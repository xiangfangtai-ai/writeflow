import { readFile } from "node:fs/promises";

export interface Chunk {
  category: string; // 分类，如「一、HTML / CSS」
  title: string; // 题目标题
  content: string; // 答案正文
}

// 加载 markdown 并按 ### 每道题切成一块
export async function loadAndSplit(): Promise<Chunk[]> {
  const text = await readFile("server/data/interview-question.md", "utf-8");
  const lines = text.split("\n");

  const chunks: Chunk[] = [];
  let category = "";
  let current: Chunk | null = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      // 分类标题：记录当前分类（注意 # 总标题也以 ## 开头？不会，# 只有一个 #）
      category = line.replace("## ", "").trim();
    } else if (line.startsWith("### ")) {
      // 新题目：先把上一块存起来
      if (current) chunks.push(current);
      current = {
        category,
        title: line.replace("### ", "").trim(),
        content: "",
      };
    } else if (current) {
      // 答案内容，追加到当前块
      current.content += line + "\n";
    }
  }
  if (current) chunks.push(current); // 别忘了最后一块
  return chunks;
}

// 测试
const chunks = await loadAndSplit();
console.log(`共切出 ${chunks.length} 块\n`);
console.log("前 2 块：");
console.log(JSON.stringify(chunks.slice(0, 2), null, 2));
