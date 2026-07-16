import { Client, LocalAuth, Message } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";
import { config } from "./config";
import { generateReply } from "./ai";
import { appendMessage, getHistory, resetHistory } from "./conversationStore";
import { isChatRateLimited, recordChatMessage, scheduleSend } from "./rateLimiter";

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: ".wwebjs_auth" }),
  puppeteer: {
    headless: true,
    executablePath: config.chromeExecutablePath,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("Escanea este código QR con WhatsApp (Dispositivos vinculados):");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Agente de WhatsApp listo.");
});

client.on("auth_failure", (message) => {
  console.error("Fallo de autenticación:", message);
});

client.on("disconnected", (reason) => {
  console.warn("Cliente desconectado:", reason);
});

function isAllowedChat(chatId: string): boolean {
  if (config.allowedChatIds.length === 0) {
    return true;
  }
  return config.allowedChatIds.includes(chatId);
}

async function handleCommand(message: Message, command: string): Promise<boolean> {
  switch (command) {
    case "reset": {
      resetHistory(message.from);
      const text = "Conversación reiniciada. ¿En qué puedo ayudarte?";
      await scheduleSend(text, () => message.reply(text));
      return true;
    }
    case "ayuda":
    case "help": {
      const text = [
        "Comandos disponibles:",
        `${config.commandPrefix}reset - Reinicia el historial de la conversación`,
        `${config.commandPrefix}ayuda - Muestra esta ayuda`,
      ].join("\n");
      await scheduleSend(text, () => message.reply(text));
      return true;
    }
    default:
      return false;
  }
}

client.on("message", async (message: Message) => {
  try {
    // Evita loops con mensajes propios o de difusiones de estado.
    if (message.fromMe || message.from === "status@broadcast") {
      return;
    }

    const chat = await message.getChat();

    if (chat.isGroup && !config.respondToGroups) {
      return;
    }
    if (!isAllowedChat(message.from)) {
      return;
    }
    if (message.type !== "chat" || !message.body?.trim()) {
      return;
    }

    const body = message.body.trim();
    if (body.startsWith(config.commandPrefix)) {
      const command = body.slice(config.commandPrefix.length).toLowerCase().split(/\s+/)[0];
      if (await handleCommand(message, command)) {
        return;
      }
    }

    // Protege el número: limita cuántas respuestas de IA se envían por chat
    // en la ventana de tiempo configurada, en vez de contestar sin freno.
    if (isChatRateLimited(message.from)) {
      console.warn(`Límite de mensajes alcanzado para ${message.from}, se omite respuesta.`);
      return;
    }

    await chat.sendStateTyping();
    appendMessage(message.from, { role: "user", content: body });

    const reply = await generateReply(getHistory(message.from));
    appendMessage(message.from, { role: "assistant", content: reply });

    await scheduleSend(reply, () => message.reply(reply));
    recordChatMessage(message.from);
  } catch (error) {
    console.error("Error procesando mensaje:", error);
    try {
      await message.reply("Ocurrió un error al procesar tu mensaje. Intenta de nuevo.");
    } catch {
      // Ignorar errores al enviar el mensaje de error.
    }
  }
});

client.initialize();

process.on("SIGINT", async () => {
  console.log("Cerrando agente de WhatsApp...");
  await client.destroy();
  process.exit(0);
});
