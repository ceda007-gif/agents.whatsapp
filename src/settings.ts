import fs from "fs";
import path from "path";
import crypto from "crypto";

const SETTINGS_PATH = path.join(process.cwd(), "data", "settings.json");

export interface RuntimeSettings {
  aiProvider: "gemini" | "anthropic";
  geminiApiKey: string;
  anthropicApiKey: string;
  aiModel: string;
  systemPrompt: string;
  whatsappToken: string;
  whatsappPhoneNumberId: string;
  whatsappVerifyToken: string;
}

const DEFAULTS: RuntimeSettings = {
  aiProvider: "gemini",
  geminiApiKey: "",
  anthropicApiKey: "",
  aiModel: "",
  systemPrompt:
    "Eres un asistente de WhatsApp amable, claro y conciso. Responde siempre en el idioma del usuario.",
  whatsappToken: "",
  whatsappPhoneNumberId: "",
  whatsappVerifyToken: "",
};

// Semilla desde .env, para quien ya traía una config anterior basada en variables de entorno.
function envSeed(): Partial<RuntimeSettings> {
  const seed: Partial<RuntimeSettings> = {};
  if (process.env.AI_PROVIDER === "gemini" || process.env.AI_PROVIDER === "anthropic") {
    seed.aiProvider = process.env.AI_PROVIDER;
  }
  if (process.env.GEMINI_API_KEY) seed.geminiApiKey = process.env.GEMINI_API_KEY;
  if (process.env.ANTHROPIC_API_KEY) seed.anthropicApiKey = process.env.ANTHROPIC_API_KEY;
  if (process.env.AI_MODEL) seed.aiModel = process.env.AI_MODEL;
  if (process.env.SYSTEM_PROMPT) seed.systemPrompt = process.env.SYSTEM_PROMPT;
  if (process.env.WHATSAPP_TOKEN) seed.whatsappToken = process.env.WHATSAPP_TOKEN;
  if (process.env.WHATSAPP_PHONE_NUMBER_ID) seed.whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (process.env.WHATSAPP_VERIFY_TOKEN) seed.whatsappVerifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
  return seed;
}

function readFromDisk(): Partial<RuntimeSettings> {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function persist(): void {
  fs.mkdirSync(path.dirname(SETTINGS_PATH), { recursive: true });
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(current, null, 2));
}

let current: RuntimeSettings = { ...DEFAULTS, ...envSeed(), ...readFromDisk() };

// El verify token lo inventa quien configura el webhook en Meta; si no hay uno, generamos
// uno seguro para que la persona no tenga que inventarlo ella misma.
if (!current.whatsappVerifyToken) {
  current.whatsappVerifyToken = crypto.randomBytes(16).toString("hex");
  persist();
}

export function getSettings(): RuntimeSettings {
  return current;
}

export function updateSettings(partial: Partial<RuntimeSettings>): RuntimeSettings {
  current = { ...current, ...partial };
  persist();
  return current;
}

export function isWhatsAppConfigured(settings: RuntimeSettings = current): boolean {
  return Boolean(settings.whatsappToken && settings.whatsappPhoneNumberId && settings.whatsappVerifyToken);
}

export function isAiConfigured(settings: RuntimeSettings = current): boolean {
  return settings.aiProvider === "gemini" ? Boolean(settings.geminiApiKey) : Boolean(settings.anthropicApiKey);
}
