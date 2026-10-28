import { embed } from "./embedding";

// 点积：对应位置相乘，再求和
export function dotProduct(a: number[], b: number[]) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// 模：向量长度（各数字平方和开根号）
export function magnitude(a: number[]) {
  let sum = 0;
  for (const x of a) sum += x * x;
  return Math.sqrt(sum);
}

// 余弦相似度：范围 -1 ~ 1，越接近 1 越相似
export function cosineSimilarity(a: number[], b: number[]) {
  return dotProduct(a, b) / (magnitude(a) * magnitude(b));
}
