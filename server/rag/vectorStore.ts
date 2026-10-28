import { embed } from "./embedding";
import { cosineSimilarity } from "./similarity";
import { loadAndSplit, type Chunk } from "./split";

interface VectorRecord {
  chunk: Chunk;
  embedding: number[];
}

// 内存向量库
export class InMemoryVectorStore {
  private records: VectorRecord[] = [];

  // 建库：每块文本转向量，连同原文一起存
  async addChunks(chunks: Chunk[]) {
    for (const chunk of chunks) {
      const text = `${chunk.title}\n${chunk.content}`;
      const embedding = await embed(text);
      this.records.push({ chunk, embedding });
    }
  }

  // 检索：问题转向量，和每条算相似度，排序取 top-k
  async search(query: string, k = 3, minScore = 0.35) {
    const queryVec = await embed(query);
    const scored = this.records.map((record) => ({
      chunk: record.chunk,
      score: cosineSimilarity(queryVec, record.embedding),
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored.filter((r) => r.score >= minScore).slice(0, k);
  }
}
