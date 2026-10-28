import { InMemoryVectorStore } from "./vectorStore";
import { loadAndSplit } from "./split";

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

// 检索并拼成 context 文本
export async function retrieveContext(question: string, k = 3) {
  const kb = await getKnowledgeBase();
  const results = await kb.search(question, k);
  const context = results
    .map((r, i) => `[资料${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
    .join("\n\n");
  return { context, results };
}
