import { config } from "./config";

const chatTimestamps = new Map<string, number[]>();

/** true si este chat ya recibió demasiadas respuestas en la ventana reciente. */
export function isChatRateLimited(chatId: string): boolean {
  const now = Date.now();
  const recent = (chatTimestamps.get(chatId) ?? []).filter(
    (ts) => now - ts < config.chatRateWindowMs,
  );
  chatTimestamps.set(chatId, recent);
  return recent.length >= config.maxMessagesPerChatWindow;
}

export function recordChatMessage(chatId: string): void {
  const recent = chatTimestamps.get(chatId) ?? [];
  recent.push(Date.now());
  chatTimestamps.set(chatId, recent);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Delay variable tipo "humano": escala con el largo del texto, dentro de [min, max]. */
function computeReplyDelayMs(text: string): number {
  const { minReplyDelayMs, maxReplyDelayMs } = config;
  const range = Math.max(0, maxReplyDelayMs - minReplyDelayMs);
  const lengthFactor = Math.min(text.length * 20, range);
  const jitter = Math.random() * (range - lengthFactor);
  return minReplyDelayMs + lengthFactor + jitter;
}

let sendQueue: Promise<void> = Promise.resolve();
let lastSendAt = 0;

/**
 * Serializa todos los envíos salientes: aplica un delay tipo "humano" antes de
 * cada respuesta y garantiza un espaciado mínimo global entre mensajes, para
 * evitar patrones de envío que WhatsApp asocie con un bot/spam.
 */
export function scheduleSend<T>(replyText: string, task: () => Promise<T>): Promise<T> {
  const run = sendQueue.then(async () => {
    const humanDelay = computeReplyDelayMs(replyText);
    const sinceLastSend = Date.now() - lastSendAt;
    const globalWait = Math.max(0, config.minMessageIntervalMs - sinceLastSend);
    await sleep(Math.max(humanDelay, globalWait));
    lastSendAt = Date.now();
    return task();
  });
  // Evita que un rechazo detenga la cola para los siguientes mensajes.
  sendQueue = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}
