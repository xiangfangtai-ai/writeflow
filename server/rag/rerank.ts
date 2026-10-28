// 调用硅基流动 Rerank，对候选文档重新打分排序
export async function rerank(query: string, documents: string[], topN: number) {
  const res = await fetch("https://api.siliconflow.cn/v1/rerank", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
    },
    body: JSON.stringify({
      model: "BAAI/bge-reranker-v2-m3",
      query,
      documents,
      top_n: topN,
      return_documents: false,
    }),
  });
  const data = await res.json();
  if (!data.results) {
    throw new Error("Rerank 调用失败：" + JSON.stringify(data));
  }
  // 返回排好序的「原索引 + 相关性分数」
  return data.results as { index: number; relevance_score: number }[];
}
