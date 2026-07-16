import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

export const config = {
  anthropicApiKey: required("ANTHROPIC_API_KEY"),
  model: process.env.CLAUDE_MODEL ?? "claude-sonnet-5",
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
