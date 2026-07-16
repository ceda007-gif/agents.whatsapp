import express, { Request, Response } from "express";
import { config } from "./config";
import { generateReply } from "./ai";
import { appendMessage, getHistory, resetHistory } from "./conversationStore";
import { isChatRateLimited, recordChatMessage, scheduleSend } from "./rateLimiter";
import { markAsRead, sendTextMessage } from "./whatsapp/cloudApi";
import type { IncomingTextMessage, WhatsAppWebhookPayload } from "./whatsapp/webhookTypes";
import { getSettings, isAiConfigured, isWhatsAppConfigured, updateSettings } from "./settings";
import { requireAdminAuth } from "./admin/auth";
import { renderAdminPage } from "./admin/template";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isAllowedChat(chatId: string): boolean {
  if (config.allowedChatIds.length === 0) {
    return true;
  }
  return config.allowedChatIds.includes(chatId);
}

async function handleCommand(from: string, command: string): Promise<boolean> {
  switch (command) {
    case "reset": {
      resetHistory(from);
      const text = "Conversación reiniciada. ¿En qué puedo ayudarte?";
      await scheduleSend(text, () => sendTextMessage(from, text));
      return true;
    }
    case "ayuda":
    case "help": {
      const text = [
        "Comandos disponibles:",
        `${config.commandPrefix}reset - Reinicia el historial de la conversación`,
        `${config.commandPrefix}ayuda - Muestra esta ayuda`,
      ].join("\n");
      await scheduleSend(text, () => sendTextMessage(from, text));
      return true;
    }
    default:
      return false;
  }
}

async function handleIncomingMessage(message: IncomingTextMessage): Promise<void> {
  try {
    markAsRead(message.id).catch((error) => console.error("No se pudo marcar como leído:", error));

    if (message.type !== "text" || !message.text?.body.trim()) {
      return;
    }
    if (!isAllowedChat(message.from)) {
      return;
    }
    if (!isAiConfigured()) {
      console.warn("Mensaje recibido pero la IA aún no está configurada (entra a /admin).");
      return;
    }

    const body = message.text.body.trim();
    if (body.startsWith(config.commandPrefix)) {
      const command = body.slice(config.commandPrefix.length).toLowerCase().split(/\s+/)[0];
      if (await handleCommand(message.from, command)) {
        return;
      }
    }

    if (isChatRateLimited(message.from)) {
      console.warn(`Límite de mensajes alcanzado para ${message.from}, se omite respuesta.`);
      return;
    }

    appendMessage(message.from, { role: "user", content: body });
    const reply = await generateReply(getHistory(message.from));
    appendMessage(message.from, { role: "assistant", content: reply });

    await scheduleSend(reply, () => sendTextMessage(message.from, reply));
    recordChatMessage(message.from);
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    try {
      const text = "Ocurrió un error al procesar tu mensaje. Intenta de nuevo.";
      await scheduleSend(text, () => sendTextMessage(message.from, text));
    } catch {
      // Ignorar errores al enviar el mensaje de error.
    }
  }
}

app.get("/", (_req: Request, res: Response) => {
  res.type("text/plain").send("Agente de WhatsApp corriendo. Ve a /admin para configurarlo.");
});

app.get("/webhook", (req: Request, res: Response) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === getSettings().whatsappVerifyToken) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post("/webhook", (req: Request, res: Response) => {
  // Responder rápido: Meta reintenta el webhook si no recibe 200 a tiempo.
  res.sendStatus(200);

  if (!isWhatsAppConfigured()) {
    console.warn("Llegó un webhook pero WhatsApp aún no está configurado (entra a /admin).");
    return;
  }

  const payload = req.body as WhatsAppWebhookPayload;
  const messages = payload.entry?.flatMap((entry) =>
    entry.changes.flatMap((change) => change.value.messages ?? []),
  );

  for (const message of messages ?? []) {
    handleIncomingMessage(message).catch((error) =>
      console.error("Error no controlado procesando mensaje:", error),
    );
  }
});

app.get("/admin", requireAdminAuth, (req: Request, res: Response) => {
  const settings = getSettings();
  const message = req.query.saved === "1" ? "Configuración guardada correctamente." : undefined;
  res.type("html").send(
    renderAdminPage(
      settings,
      { whatsappConfigured: isWhatsAppConfigured(settings), aiConfigured: isAiConfigured(settings) },
      message,
    ),
  );
});

app.post("/admin/save", requireAdminAuth, (req: Request, res: Response) => {
  const body = req.body as Record<string, string>;
  const current = getSettings();

  // Los campos de secretos llegan vacíos si el usuario no quiso cambiarlos: se conserva el valor actual.
  const pickTrimmedOrKeep = (value: unknown, existing: string): string => {
    const trimmed = typeof value === "string" ? value.trim() : "";
    return trimmed || existing;
  };

  updateSettings({
    aiProvider: body.aiProvider === "anthropic" ? "anthropic" : "gemini",
    geminiApiKey: pickTrimmedOrKeep(body.geminiApiKey, current.geminiApiKey),
    anthropicApiKey: pickTrimmedOrKeep(body.anthropicApiKey, current.anthropicApiKey),
    aiModel: typeof body.aiModel === "string" ? body.aiModel.trim() : current.aiModel,
    systemPrompt:
      typeof body.systemPrompt === "string" && body.systemPrompt.trim()
        ? body.systemPrompt.trim()
        : current.systemPrompt,
    whatsappToken: pickTrimmedOrKeep(body.whatsappToken, current.whatsappToken),
    whatsappPhoneNumberId: pickTrimmedOrKeep(body.whatsappPhoneNumberId, current.whatsappPhoneNumberId),
    whatsappVerifyToken: pickTrimmedOrKeep(body.whatsappVerifyToken, current.whatsappVerifyToken),
  });

  res.redirect("/admin?saved=1");
});

app.listen(config.port, () => {
  console.log(`Agente de WhatsApp escuchando en el puerto ${config.port}`);
  console.log(`Webhook: http://localhost:${config.port}/webhook`);
  console.log(`Panel de administración: http://localhost:${config.port}/admin`);
});
