import "dotenv/config";
import { runAgent } from "./runAgent";

const answer = await runAgent("现在几点了？");
console.log("\n最终答案：", answer);
