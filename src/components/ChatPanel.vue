<script setup lang="ts">
import { nextTick, ref } from "vue";
import { marked } from "marked";
import { streamChat, type ChatMessage } from "../api/client";

import DOMPurify from "dompurify";

const messages = ref<ChatMessage[]>([]);
const input = ref("");
const loading = ref(false);
const listRef = ref<HTMLElement>();
let abortController: AbortController | null = null;

async function scrollToBottom() {
  await nextTick();
  listRef.value?.scrollTo({ top: listRef.value.scrollHeight });
}

function renderMarkdown(text: string) {
  const rawHtml = marked.parse(text, { async: false }) as string;
  // DOMPurify进行检查过滤
  return DOMPurify.sanitize(rawHtml);
}

async function send() {
  const content = input.value.trim();
  if (!content || loading.value) return;

  messages.value.push({ role: "user", content });
  input.value = "";
  loading.value = true;
  await scrollToBottom();
  // 空的助手消息占位，token 到了就往里追加
  const assistantIndex = messages.value.length;
  messages.value.push({ role: "assistant", content: "" });

  abortController = new AbortController();
  try {
    // 只发已有内容的消息，空的助手消息不发
    await streamChat(
      messages.value.filter((m) => m.content),
      (token) => {
        messages.value[assistantIndex].content += token;
        scrollToBottom();
      },
      abortController.signal,
    );
  } catch (e) {
    if ((e as Error).name !== "AbortError") {
      messages.value[assistantIndex].content +=
        `\n\n> 请求出错：${(e as Error).message}`;
    }
  } finally {
    loading.value = false;
    abortController = null;
    scrollToBottom();
  }
}

function stop() {
  abortController?.abort();
  loading.value = false;
}
</script>

<template>
  <div class="chat">
    <header class="chat-header">前端面试助手</header>

    <div ref="listRef" class="msg-list">
      <div v-if="messages.length === 0" class="empty">
        问我任何前端问题，比如"什么是闭包？"
      </div>

      <div v-for="(m, i) in messages" :key="i" class="msg" :class="m.role">
        <div class="avatar">{{ m.role === "user" ? "我" : "AI" }}</div>
        <div class="bubble">
          <span v-html="renderMarkdown(m.content)"></span>
          <span v-if="loading && i === messages.length - 1" class="cursor"
            >▍</span
          >
        </div>
      </div>
    </div>

    <div class="input-bar">
      <button v-if="loading" class="btn stop" @click="stop">停止</button>
      <textarea
        v-model="input"
        class="input"
        rows="1"
        placeholder="输入前端问题，回车发送"
        @keydown.enter.exact.prevent="send"
      ></textarea>
      <button class="btn send" :disabled="loading" @click="send">发送</button>
    </div>
  </div>
</template>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 900px;
  margin: 0 auto;
}
.chat-header {
  padding: 14px 20px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
  background: #fff;
}
.msg-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #f9fafb;
}
.empty {
  margin: auto;
  color: #9ca3af;
}
.msg {
  display: flex;
  gap: 10px;
}
.msg.user {
  flex-direction: row-reverse;
}
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  flex: none;
}
.msg.user .avatar {
  background: #5b7bd5;
  color: #fff;
}
.msg.assistant .avatar {
  background: #e5e7eb;
  color: #374151;
}
.bubble {
  max-width: 75%;
  padding: 10px 14px;
  border-radius: 12px;
  line-height: 1.6;
  font-size: 14px;
}
.msg.user .bubble {
  background: #5b7bd5;
  color: #fff;
}
.msg.assistant .bubble {
  background: #fff;
  border: 1px solid #e5e7eb;
  color: #1f2937;
}
.cursor {
  animation: blink 1s infinite;
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
.input-bar {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
  align-items: flex-end;
}
.input {
  flex: 1;
  resize: none;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 9px 12px;
  font-size: 14px;
  font-family: inherit;
  outline: none;
}
.input:focus {
  border-color: #5b7bd5;
}
.btn {
  padding: 9px 16px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  cursor: pointer;
}
.btn.send {
  background: #5b7bd5;
  color: #fff;
}
.btn.send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn.stop {
  background: #fee2e2;
  color: #dc2626;
}
.bubble :deep(pre) {
  background: #1f2937;
  color: #e5e7eb;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
}
.bubble :deep(code) {
  font-family: ui-monospace, monospace;
  font-size: 13px;
}
.bubble :deep(:not(pre) > code) {
  background: rgba(0, 0, 0, 0.06);
  padding: 2px 5px;
  border-radius: 4px;
}
.bubble :deep(ul),
.bubble :deep(ol) {
  padding-left: 20px;
  margin: 6px 0;
}
.bubble :deep(p) {
  margin: 6px 0;
}
</style>
