import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { InMemoryVectorStore } from "./vectorStore";
import { loadAndSplit } from "./split";

// 生成模型（和 W1 一样）
const model = new ChatOpenAI({
  model: "deepseek-chat",
  apiKey: process.env.DEEPSEEK_API_KEY,
  configuration: { baseURL: "https://api.deepseek.com/v1" },
});

// 1. 建库（内存版，每次启动重建）
const store = new InMemoryVectorStore();
console.log("正在建库...");
const chunks = await loadAndSplit();
await store.addChunks(chunks);
console.log("建库完成\n");

// 2. 检索（注意：这个问题里没有"闭包"两个字，用来验证语义检索）
const question = "函数访问外部变量的特性叫什么？";
const results = await store.search(question, 3);
console.log("检索到的资料：");
results.forEach((r, i) =>
  console.log(`[资料${i + 1}] ${r.score.toFixed(4)} ${r.chunk.title}`),
);

// 3. 把检索到的材料拼成 context
const context = results
  .map((r, i) => `[资料${i + 1}] ${r.chunk.title}\n${r.chunk.content}`)
  .join("\n\n");

// 4. 调模型，让它严格基于材料回答
const answer = await model.invoke([
  {
    role: "system",
    content:
      "你是前端面试助手。请严格根据【参考资料】回答问题；资料里没有的内容就说「根据现有资料无法回答」，不要编造；并在末尾标注参考了哪几份资料。",
  },
  { role: "user", content: `【参考资料】\n${context}\n\n【问题】\n${question}` },
]);

console.log("\n最终回答：\n", answer.content);
