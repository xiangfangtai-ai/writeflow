import { executeTool, tools } from "./tools";

// 原生 OpenAI 消息格式（直接用对象字面量）
type Message =
  | { role: "system"; content: string }
  | { role: "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: ToolCall[] }
  | { role: "tool"; tool_call_id: string; content: string };

interface ToolCall {
  id: string;
  type: "function";
  function: { name: string; arguments: string };
}

const SYSTEM_PROMPT =
  "你是一个能使用工具的 AI 助手。需要工具时请调用，拿到结果后再回答。";

export async function runAgent(userInput: string) {
  // 模型无状态，每次请求都要带上完整消息历史
  const messages: Message[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: userInput },
  ];

  const MAX_STEPS = 8; // 安全阀：防止模型无限循环调工具烧钱

  for (let step = 0; step < MAX_STEPS; step++) {
    console.log(`\n--- 第 ${step + 1} 步 ---`);

    // 1. 调用模型（带上工具定义）
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({ model: "deepseek-chat", messages, tools }),
    });

    const data = await res.json();
    const message = data.choices[0].message;

    // 2. 模型这条消息原样追加（含 tool_calls，模型需要知道自己调过什么）
    messages.push(message);

    // 3. 没有工具调用 → 任务完成
    if (!message.tool_calls || message.tool_calls.length === 0) {
      console.log("模型给出最终回答，结束");
      return message.content;
    }

    // 4. 有工具调用 → 逐个执行，结果回灌
    for (const toolCall of message.tool_calls) {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || "{}");
      console.log(`调用工具: ${name}`, args);

      const result = await executeTool(name, args);
      console.log(`工具结果: ${result}`);

      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: result,
      });
    }
  }

  return "（已达到最大步骤数，强制停止）";
}
