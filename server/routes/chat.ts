import { streamSSE } from "hono/streaming";
import { Hono } from "hono";
import { z } from "zod";
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { INTERVIEWER_PROMPT, model } from "../ai/model";
import { retrieveContext } from "../rag/knowledgeBase";

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

  const history = parsed.data.messages.map((m) =>
    m.role === "user" ? new HumanMessage(m.content) : new AIMessage(m.content),
  );

  // RAG：取最后一条用户消息（多轮时最新问题才是检索目标），检索知识库
  const lastUser = [...parsed.data.messages]
    .reverse()
    .find((m) => m.role === "user");
  let systemPrompt = INTERVIEWER_PROMPT;
  if (lastUser) {
    const { context } = await retrieveContext(lastUser.content, 3);
    systemPrompt = `${INTERVIEWER_PROMPT}\n\n【知识库参考资料】（优先参考，资料没有的不要编造）：\n\n${context}`;
  }

  const messages = [new SystemMessage(systemPrompt), ...history];

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
