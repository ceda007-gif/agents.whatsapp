import Anthropic from "@anthropic-ai/sdk";
import { config } from "./config";
import type { ChatMessage } from "./conversationStore";

const client = new Anthropic({ apiKey: config.anthropicApiKey });

export async function generateReply(history: ChatMessage[]): Promise<string> {
  const response = await client.messages.create({
    model: config.model,
    max_tokens: config.maxOutputTokens,
    system: config.systemPrompt,
    messages: history.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text"
    ? textBlock.text
    : "Lo siento, no pude generar una respuesta en este momento.";
}
