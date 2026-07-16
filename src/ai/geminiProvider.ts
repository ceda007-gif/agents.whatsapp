import { GoogleGenAI } from "@google/genai";
import { config } from "../config";
import { getSettings } from "../settings";
import type { ChatMessage } from "../conversationStore";

const DEFAULT_MODEL = "gemini-3.1-flash-lite";

export async function generateReply(history: ChatMessage[]): Promise<string> {
  const settings = getSettings();
  const client = new GoogleGenAI({ apiKey: settings.geminiApiKey });

  const response = await client.models.generateContent({
    model: settings.aiModel || DEFAULT_MODEL,
    contents: history.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [{ text: message.content }],
    })),
    config: {
      systemInstruction: settings.systemPrompt,
      maxOutputTokens: config.maxOutputTokens,
    },
  });

  return response.text?.trim() || "Lo siento, no pude generar una respuesta en este momento.";
}
