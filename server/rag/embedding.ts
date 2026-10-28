import "dotenv/config";

export async function embed(text: string): Promise<number[]> {
  const res = await fetch("https://api.siliconflow.cn/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SILICONFLOW_API_KEY}`,
    },
    body: JSON.stringify({
      model: "BAAI/bge-large-zh-v1.5",
      input: text,
      encoding_format: "float",
    }),
  });

  const data = await res.json();
  if (!data.data) {
    throw new Error("Embedding 调用失败：" + JSON.stringify(data));
  }
  return data.data[0].embedding;
}

// 测试：三句话转向量
const texts = ["什么是闭包", "闭包的概念是什么", "今天天气怎么样"];
for (const text of texts) {
  const vec = await embed(text);
  console.log(
    `「${text}」→ 维度 ${vec.length}，前 5 个数字：`,
    vec.slice(0, 5),
  );
}
