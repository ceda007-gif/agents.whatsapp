import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config";
import type { ChatMessage } from "../conversationStore";

let client: Anthropic | undefined;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: config.anthropicApiKey });
  }
  return client;
}

export async function generateReply(history: ChatMessage[]): Promise<string> {
  const response = await getClient().messages.create({
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
