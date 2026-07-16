import { getSettings } from "../settings";
import type { ChatMessage } from "../conversationStore";
import { generateReply as generateAnthropicReply } from "./anthropicProvider";
import { generateReply as generateGeminiReply } from "./geminiProvider";

export function generateReply(history: ChatMessage[]): Promise<string> {
  switch (getSettings().aiProvider) {
    case "gemini":
      return generateGeminiReply(history);
    case "anthropic":
      return generateAnthropicReply(history);
  }
}
