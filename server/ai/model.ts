import { ChatOpenAI } from '@langchain/openai'

// DeepSeek 接口与 OpenAI 完全兼容，只需替换 baseURL 和模型名
// 后续切换其他模型（豆包 / Kimi / Claude）时，只改这里即可
export const model = new ChatOpenAI({
  model: process.env.DEEPSEEK_MODEL ?? 'deepseek-chat',
  apiKey: process.env.DEEPSEEK_API_KEY,
  temperature: 0.6,
  maxTokens: 2048,
  configuration: {
    baseURL: 'https://api.deepseek.com/v1',
  },
})

// 面试助手的系统提示词（Prompt 工程的核心，后续 RAG 阶段会继续迭代）
export const INTERVIEWER_PROMPT = `你是「前端面试助手」，一位拥有 10 年经验的前端技术面试官。

你的职责：
1. 回答前端相关问题（HTML / CSS / JavaScript / TypeScript / Vue / React / 工程化 / 性能 / 浏览器 / 网络等），回答准确、有代码示例、有深度。
2. 根据用户要求出题、追问，并像真实面试一样评估用户的回答，指出问题和改进方向。

回答要求：
- 使用 Markdown 格式，代码块标注语言
- 不确定的内容明确说明，不编造 API 和结论
- 先给结论，再解释原理，由浅入深`
