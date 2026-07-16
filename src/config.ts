import "dotenv/config";

// process.env[name] puede ser "" si la variable quedó vacía en .env; se trata como no definida.
function required(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Falta la variable de entorno ${name}`);
  }
  return value;
}

function optional(name: string, fallback: string): string {
  return process.env[name] || fallback;
}

export const config = {
  // Única contraseña que se toca por variable de entorno: protege el panel /admin,
  // donde se configura todo lo demás (token de WhatsApp, API keys, prompt del negocio).
  adminPassword: required("ADMIN_PASSWORD"),

  maxHistoryMessages: Number(process.env.MAX_HISTORY_MESSAGES ?? 20),
  maxOutputTokens: Number(process.env.MAX_OUTPUT_TOKENS ?? 1024),
  allowedChatIds: (process.env.ALLOWED_CHAT_IDS ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean),
  commandPrefix: process.env.COMMAND_PREFIX ?? "/",

  whatsappApiVersion: optional("WHATSAPP_API_VERSION", "v23.0"),
  port: Number(process.env.PORT ?? 3000),

  // Control de costos y buen comportamiento: espaciado y límites de envío.
  minReplyDelayMs: Number(process.env.MIN_REPLY_DELAY_MS ?? 1500),
  maxReplyDelayMs: Number(process.env.MAX_REPLY_DELAY_MS ?? 6000),
  minMessageIntervalMs: Number(process.env.MIN_MESSAGE_INTERVAL_MS ?? 2500),
  maxMessagesPerChatWindow: Number(process.env.MAX_MESSAGES_PER_CHAT_WINDOW ?? 8),
  chatRateWindowMs: Number(process.env.CHAT_RATE_WINDOW_MS ?? 5 * 60 * 1000),
};
