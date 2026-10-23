import { streamSSE } from "hono/streaming";
import { Hono } from "hono";
import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { INTERVIEWER_PROMPT, model } from "../ai/model";
const chat = new Hono();

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1),
      }),
    )
    .min(1),
});
chat.post("/", async (c) => {
  const body = await c.req.json();
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return c.json(
      { error: "请求参数不合法", detail: parsed.error.flatten() },
      400,
    );
  }
  // 转成Langchain消息 最前面插入系统提示词
  const history = parsed.data.messages.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
  );
  const messages = [new SystemMessage(INTERVIEWER_PROMPT), ...history];
  // 等待答案生成后一次性返回 （后续改为流式）
  //   const replay = await model.invoke(messages);

  //   return c.json({ role: "assistant", content: replay.content });
  return streamSSE(c, async (stream) => {
    const tokenStream = await model.stream(messages);
    for await (const chunk of tokenStream) {
      const text = typeof chunk.content === "string" ? chunk.content : "";
      await stream.writeSSE({
        data: JSON.stringify({ content: text }),
      });
    }
  });
});

export default chat;
