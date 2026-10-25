export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
export async function streamChat(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  signal?: AbortSignal,
) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify({ messages }),
    signal,
  });
  if (!res.ok || !res.body) {
    throw new Error(`请求失败, 状态码: ${res.status}`);
  }
  // 向莺啼
  const reader = res.body.getReader();

  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    // 处理汉字可能被拆分的情况
    buffer += decoder.decode(value, { stream: true });

    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event.split("\n").find((l) => l.startsWith("data:"));
      if (!line) continue;
      const json = line.slice("data:".length).trim();
      try {
        const { content } = JSON.parse(json) as { content: string };
        if (content) onToken(content);
      } catch {}
    }
  }
}
