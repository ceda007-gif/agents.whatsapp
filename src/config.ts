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
};
