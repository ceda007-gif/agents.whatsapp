import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config";
import { getSettings } from "../settings";
import type { ChatMessage } from "../conversationStore";

const DEFAULT_MODEL = "claude-sonnet-5";

export async function generateReply(history: ChatMessage[]): Promise<string> {
  const settings = getSettings();
  const client = new Anthropic({ apiKey: settings.anthropicApiKey });

  const response = await client.messages.create({
    model: settings.aiModel || DEFAULT_MODEL,
    max_tokens: config.maxOutputTokens,
    system: settings.systemPrompt,
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
