import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

const aiProvider = (process.env.AI_PROVIDER ?? "gemini").toLowerCase();
if (aiProvider !== "gemini" && aiProvider !== "anthropic") {
  throw new Error(`AI_PROVIDER inválido: "${aiProvider}". Usa "gemini" o "anthropic".`);
}

const defaultModel = aiProvider === "gemini" ? "gemini-3.1-flash-lite" : "claude-sonnet-5";

export const config = {
  aiProvider: aiProvider as "gemini" | "anthropic",
  anthropicApiKey: aiProvider === "anthropic" ? required("ANTHROPIC_API_KEY") : process.env.ANTHROPIC_API_KEY,
  geminiApiKey: aiProvider === "gemini" ? required("GEMINI_API_KEY") : process.env.GEMINI_API_KEY,
  model: process.env.AI_MODEL ?? defaultModel,
  systemPrompt:
    process.env.SYSTEM_PROMPT ??
    "Eres un asistente de WhatsApp amable, claro y conciso. Responde siempre en el idioma del usuario.",
  maxHistoryMessages: Number(process.env.MAX_HISTORY_MESSAGES ?? 20),
  maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS ?? 1024),
  allowedChatIds: (process.env.ALLOWED_CHAT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  respondToGroups: (process.env.RESPOND_TO_GROUPS ?? "false").toLowerCase() === "true",
  commandPrefix: process.env.COMMAND_PREFIX ?? "/",
  chromeExecutablePath: process.env.CHROME_EXECUTABLE_PATH,

  // Mitigaciones anti-baneo: espaciado y límites de envío.
  minReplyDelayMs: Number(process.env.MIN_REPLY_DELAY_MS ?? 1500),
  maxReplyDelayMs: Number(process.env.MAX_REPLY_DELAY_MS ?? 6000),
  minMessageIntervalMs: Number(process.env.MIN_MESSAGE_INTERVAL_MS ?? 2500),
  maxMessagesPerChatWindow: Number(process.env.MAX_MESSAGES_PER_CHAT_WINDOW ?? 8),
  chatRateWindowMs: Number(process.env.CHAT_RATE_WINDOW_MS ?? 5 * 60 * 1000),
};
