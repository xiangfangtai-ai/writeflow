// ==========：获取当前时间 ==========
function getCurrentTime() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

const getCurrentTimeSchema = {
  type: "function",
  function: {
    name: "getCurrentTime",
    description:
      "当用户询问当前时间、现在几点、今天日期时使用，返回当前日期和时间。",
    parameters: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
};

// =========计算器 ==========
function calculator(args: { expression: string }) {
  const expr = args.expression;
  // 安全：工具的输入是模型给的，要当不可信输入，只允许数字和数学运算符
  if (!/^[0-9+\-*/().\s%]+$/.test(expr)) {
    return "错误：表达式包含非法字符";
  }
  try {
    const result = Function(`"use strict"; return (${expr})`)();
    return String(result);
  } catch {
    return "错误：表达式无法计算";
  }
}

const calculatorSchema = {
  type: "function",
  function: {
    name: "calculator",
    description: "进行数学计算，当用户需要精确的算术、数值计算时使用。",
    parameters: {
      type: "object",
      properties: {
        expression: {
          type: "string",
          description: "数学表达式，例如 1234 * 5678 或 (1+2)*3",
        },
      },
      required: ["expression"],
      additionalProperties: false,
    },
  },
};

export const tools = [getCurrentTimeSchema, calculatorSchema];

// 工具名 → 函数的映射
const toolFunctions: Record<string, (args: any) => string> = {
  getCurrentTime: () => getCurrentTime(),
  calculator: (args) => calculator(args),
};

// 统一执行入口
export async function executeTool(name: string, args: any): Promise<string> {
  const fn = toolFunctions[name];
  if (!fn) return `错误：没有名为 ${name} 的工具`;
  return fn(args);
}
