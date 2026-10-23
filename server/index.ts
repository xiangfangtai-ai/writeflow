// 踩坑点 带有副作用的环境引入放在顶部 否则执行chat初始化时找不到环境
import "dotenv/config";
import chat from "./routes/chat";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
const app = new Hono();
// 允许api请求跨域访问
app.use("/api/*", cors());
// 健康检查 看看服务起了没
app.get("/api/health", (c) => {
  return c.json({ status: "ok", time: new Date().toISOString() });
});

app.route("/api/chat", chat);

const port = Number(process.env.PORT) ?? 3001;

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API 服务正运行在 http://localhost:${info.port}`);
});
