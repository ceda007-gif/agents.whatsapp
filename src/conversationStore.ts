import { config } from "./config";

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

const histories = new Map<string, ChatMessage[]>();

export function getHistory(chatId: string): ChatMessage[] {
  return histories.get(chatId) ?? [];
}

export function appendMessage(chatId: string, message: ChatMessage): void {
  const history = histories.get(chatId) ?? [];
  history.push(message);
  const overflow = history.length - config.maxHistoryMessages;
  if (overflow > 0) {
    history.splice(0, overflow);
  }
  histories.set(chatId, history);
}

export function resetHistory(chatId: string): void {
  histories.delete(chatId);
}
