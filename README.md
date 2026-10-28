# WriteFlow · AI 前端面试助手

基于 **RAG（检索增强生成）** 的 AI 知识库问答应用，为前端学习者提供基于专属知识库的问答与面试辅导。采用前后端分离架构：前端 **Vue3 + TypeScript + Vite**，后端 **Hono + LangChain.js**，通过 **SSE** 实现逐 token 流式输出。

## 功能特性

- **知识库问答**：回答严格基于检索到的知识库资料，知识库中没有相关内容时明确提示、不编造；
- **流式输出**：后端通过 SSE 逐 token 推送，前端边接收边渲染，支持随时中断生成；
- **Markdown 渲染**：支持代码块、列表等 Markdown 内容，并经 DOMPurify 消毒防 XSS；
- **多轮对话**：每次请求携带完整对话历史，支持上下文连续追问；
- **两阶段检索**：HyDE 查询改写 + 向量粗召回 + Rerank 精排，提升口语问题的命中率；
- **Function Calling 智能体**：模型可自主调用时间查询、计算器等工具完成任务。

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 前端 | Vue 3（`<script setup>`）、TypeScript、Vite |
| 后端 | Hono、Node.js（tsx 运行）、dotenv、Zod |
| 大模型 | DeepSeek（OpenAI 兼容接口）、LangChain.js |
| Embedding | 硅基流动 `BAAI/bge-large-zh-v1.5` |
| Rerank | 硅基流动 `BAAI/bge-reranker-v2-m3` |
| 前端渲染与安全 | marked、DOMPurify |

## 系统架构

```
浏览器（Vue3）                    后端（Hono + LangChain.js）
┌─────────────────┐              ┌──────────────────────────────┐
│  ChatPanel.vue  │  POST /api/chat                           │
│  对话界面 / 渲染 │ ───────────►  │  参数校验（Zod）              │
│                 │              │            │                 │
│  api/client.ts  │  SSE 流      │  RAG 检索 ──► 拼装 System Prompt
│  解析 SSE 流    │ ◄─────────── │            │                 │
│  AbortController│  逐 token    │  DeepSeek 模型流式输出        │
└─────────────────┘              └──────────────────────────────┘
```

## RAG 检索流程

1. **文档切片**：将 101 道、覆盖 8 大分类的前端面试题 Markdown，按 `###` 标题结构化为独立文本块；
2. **向量化建库**：每个文本块经 `bge-large-zh-v1.5` 生成向量，存入自研内存向量库（服务启动时单例建库复用）；
3. **HyDE 查询改写**：让模型先根据口语问题生成一段带标准术语的「假设性答案」，用它代替原始问题检索；
4. **粗召回**：问题向量与库内向量计算余弦相似度，阈值过滤后取 Top10 候选；
5. **Rerank 精排**：用 `bge-reranker-v2-m3` 对候选重新打分，取 Top3；
6. **拼装 Prompt**：将检索资料注入 System Prompt，约束模型优先参考资料、无资料不编造。

## 项目结构

```
writeflow
├── src/                        # 前端
│   ├── api/client.ts           # SSE 流式请求封装（fetch + ReadableStream）
│   ├── components/ChatPanel.vue# 聊天界面（Markdown 渲染、中断、自动滚动）
│   ├── App.vue
│   └── main.ts
├── server/                     # 后端
│   ├── index.ts                # Hono 入口：CORS、健康检查、启动建库
│   ├── routes/chat.ts          # /api/chat：RAG 检索 + SSE 流式响应
│   ├── ai/model.ts             # 模型与系统提示词配置
│   ├── rag/
│   │   ├── split.ts            # Markdown 结构化切片
│   │   ├── embedding.ts        # 向量模型调用
│   │   ├── vectorStore.ts      # 自研内存向量库
│   │   ├── similarity.ts       # 余弦相似度（点积 / 向量模）
│   │   ├── rerank.ts           # Rerank 精排
│   │   └── knowledgeBase.ts    # 建库单例、HyDE、检索编排
│   ├── agent/
│   │   ├── runagent.ts         # 手写 Function Calling Agent Loop
│   │   └── tools.ts            # 工具定义（时间查询、计算器）
│   └── data/interview-question.md  # 知识库原始数据
├── docs/learning/W1.md         # 学习复盘记录
├── vite.config.ts              # Vite 配置（/api 代理到 3001）
└── .env.example                # 环境变量示例
```

## 快速开始

### 环境要求

- Node.js >= 22（见 `.nvmrc`）
- [DeepSeek](https://platform.deepseek.com/) API Key
- [硅基流动](https://cloud.siliconflow.cn/) API Key（用于 Embedding 与 Rerank）

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

在 `.env` 中填入：

```
DEEPSEEK_API_KEY=sk-你的key
DEEPSEEK_MODEL=deepseek-chat
SILICONFLOW_API_KEY=你的key
PORT=3001
```

### 3. 启动后端（在项目根目录执行）

```bash
npx tsx server/index.ts
```

启动时会自动初始化知识库（为 101 个文本块逐个生成向量，需等待片刻），成功后监听 `http://localhost:3001`。

### 4. 启动前端（新开一个终端）

```bash
npm run dev
```

Vite 默认运行在 `http://localhost:5173`，已配置将 `/api` 请求代理到 `http://localhost:3001`。

> 也可用 concurrently 一键启动前后端：
> ```bash
> npx concurrently "npx tsx server/index.ts" "npm run dev"
> ```

## API 说明

### `POST /api/chat`

请求体：

```json
{
  "messages": [
    { "role": "user", "content": "什么是闭包？" }
  ]
}
```

响应：`text/event-stream`，每个事件为一个 token：

```
data: {"content":"闭包"}

data: {"content":"是指"}
```

### `GET /api/health`

健康检查，返回服务状态与当前时间。

## 说明

- API Key 统一存放在后端 `.env` 中，不下发前端，避免泄露；
- 智能体（Agent）与 RAG 为两条独立链路，Agent 演示代码位于 `server/agent/`；
- 学习过程与踩坑记录见 [`docs/learning/W1.md`](docs/learning/W1.md)。
