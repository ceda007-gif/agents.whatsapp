import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import type { ChatMessage } from "../conversationStore";

let client: GoogleGenAI | undefined;

function getClient(): GoogleGenAI {
  if (!client) {
    client = new GoogleGenAI({ apiKey: config.geminiApiKey });
  }
  return client;
}

export async function generateReply(history: ChatMessage[]): Promise<string> {
  const response = await getClient().models.generateContent({
    model: config.model,
    contents: history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    config: {
      systemInstruction: config.systemPrompt,
      maxOutputTokens: config.maxOutputTokens,
    },
  });

  return response.text?.trim() || "Lo siento, no pude generar una respuesta en este momento.";
}
