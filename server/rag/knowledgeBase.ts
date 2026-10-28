import { InMemoryVectorStore } from "./vectorStore";
import { loadAndSplit } from "./split";
import { rerank } from "./rerank";
import { model } from "../ai/model";

let store: InMemoryVectorStore | null = null;

// 懒加载：第一次调用时建库，之后复用（单例）
export async function getKnowledgeBase() {
  if (!store) {
    store = new InMemoryVectorStore();
    const chunks = await loadAndSplit();
    await store.addChunks(chunks);
    console.log("知识库建库完成");
  }
  return store;
}

// HyDE：让模型先写一个"假设性答案"（带术语），用它去检索，不展示给用户
async function generateHypotheticalAnswer(question: string) {
  const res = await model.invoke([
    {
      role: "system",
      content:
        "你是检索查询改写器。请用 2-3 句话直接回答用户问题，回答中必须包含相关的标准术语和英文关键词（如 debounce、Promise 等）。不要提问、不要寒暄。此内容只用于检索，不会展示给用户。",
    },
    { role: "user", content: question },
  ]);
  return typeof res.content === "string" ? res.content : "";
}

// 检索并拼成 context 文本
export async function retrieveContext(question: string, k = 3) {
  const kb = await getKnowledgeBase();

  // 0. HyDE：把口语问题改写成假设答案，用它检索
  const searchQuery = await generateHypotheticalAnswer(question);
  console.log("假设答案：", searchQuery.slice(0, 70));

  // 1. 粗召回：用假设答案捞 10 块
  const candidates = await kb.search(searchQuery, 10, 0.2);
  console.log("粗召回：", candidates.map((c) => c.chunk.title).join("、"));
  if (candidates.length === 0) {
    return { context: "", results: [] };
  }

  // 2. 精排：用【原始问题】对候选重新打分
  const documents = candidates.map(
    (c) => `${c.chunk.title}\n${c.chunk.content}`,
  );
  // 用假设答案（带术语）做精排，而不是原始口语问题
  const reranked = await rerank(searchQuery, documents, k);

  // 3. 映射回候选块
  const results = reranked.map((r) => ({
    chunk: candidates[r.index].chunk,
    score: r.relevance_score,
  }));
  console.log("精排后：", results.map((r) => r.chunk.title).join("、"));

  const context = results
    .map((r, i) => `[资料${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
    .join("\n\n");
  return { context, results };
}
