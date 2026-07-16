import type { RuntimeSettings } from "../settings";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function secretHint(value: string): string {
  return value
    ? `Configurado (termina en ${escapeHtml(value.slice(-4))}) — deja vacío para no cambiarlo`
    : "No configurado";
}

function statusBadge(ok: boolean, label: string): string {
  const color = ok ? "#16a34a" : "#dc2626";
  const text = ok ? "Configurado" : "Falta configurar";
  return `<div class="status"><span class="dot" style="background:${color}"></span><strong>${label}:</strong> ${text}</div>`;
}

export function renderAdminPage(
  settings: RuntimeSettings,
  flags: { whatsappConfigured: boolean; aiConfigured: boolean },
  message?: string,
): string {
  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Panel del agente de WhatsApp</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: system-ui, -apple-system, sans-serif; max-width: 640px; margin: 0 auto; padding: 24px 16px 64px; line-height: 1.4; }
  h1 { font-size: 1.4rem; margin-bottom: 4px; }
  h2 { font-size: 1.05rem; margin-top: 32px; border-bottom: 1px solid #8884; padding-bottom: 6px; }
  .subtitle { opacity: 0.7; margin-top: 0; }
  .status { display: flex; align-items: center; gap: 8px; margin: 6px 0; }
  .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  label { display: block; font-weight: 600; margin-top: 16px; margin-bottom: 4px; font-size: 0.92rem; }
  .hint { font-size: 0.8rem; opacity: 0.65; margin: 2px 0 0; }
  input[type=text], input[type=password], select, textarea {
    width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
    border: 1px solid #8886; font-size: 1rem; background: transparent; color: inherit;
  }
  textarea { min-height: 110px; resize: vertical; font-family: inherit; }
  button { margin-top: 24px; padding: 12px 20px; border-radius: 8px; border: none; background: #2563eb; color: white; font-size: 1rem; cursor: pointer; width: 100%; }
  button:hover { background: #1d4ed8; }
  .message { background: #16a34a22; border: 1px solid #16a34a; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; }
  .verify-token { font-family: monospace; }
  fieldset { border: none; padding: 0; margin: 0; }
</style>
</head>
<body>
  <h1>Panel del agente de WhatsApp</h1>
  <p class="subtitle">Configura aquí el bot, sin tocar archivos ni la terminal.</p>

  ${message ? `<div class="message">${escapeHtml(message)}</div>` : ""}

  <h2>Estado</h2>
  ${statusBadge(flags.whatsappConfigured, "WhatsApp")}
  ${statusBadge(flags.aiConfigured, "Inteligencia artificial")}

  <form method="post" action="/admin/save">
    <h2>Inteligencia artificial</h2>

    <label for="aiProvider">Proveedor</label>
    <select id="aiProvider" name="aiProvider">
      <option value="gemini" ${settings.aiProvider === "gemini" ? "selected" : ""}>Gemini (Google, tiene nivel gratuito)</option>
      <option value="anthropic" ${settings.aiProvider === "anthropic" ? "selected" : ""}>Claude (Anthropic)</option>
    </select>

    <label for="geminiApiKey">Gemini API Key</label>
    <input type="password" id="geminiApiKey" name="geminiApiKey" placeholder="${secretHint(settings.geminiApiKey)}" autocomplete="off" />
    <p class="hint">${secretHint(settings.geminiApiKey)}</p>

    <label for="anthropicApiKey">Anthropic API Key</label>
    <input type="password" id="anthropicApiKey" name="anthropicApiKey" placeholder="${secretHint(settings.anthropicApiKey)}" autocomplete="off" />
    <p class="hint">${secretHint(settings.anthropicApiKey)}</p>

    <label for="aiModel">Modelo (opcional, déjalo vacío para usar el recomendado)</label>
    <input type="text" id="aiModel" name="aiModel" value="${escapeHtml(settings.aiModel)}" placeholder="ej. gemini-3.1-flash-lite" />

    <label for="systemPrompt">Información / personalidad del negocio</label>
    <textarea id="systemPrompt" name="systemPrompt">${escapeHtml(settings.systemPrompt)}</textarea>
    <p class="hint">Esto define cómo responde el bot: qué hace tu negocio, tono, qué no debe prometer, etc.</p>

    <h2>WhatsApp Business (Meta)</h2>

    <label for="whatsappToken">Token de acceso</label>
    <input type="password" id="whatsappToken" name="whatsappToken" placeholder="${secretHint(settings.whatsappToken)}" autocomplete="off" />
    <p class="hint">${secretHint(settings.whatsappToken)}</p>

    <label for="whatsappPhoneNumberId">Phone Number ID</label>
    <input type="text" id="whatsappPhoneNumberId" name="whatsappPhoneNumberId" value="${escapeHtml(settings.whatsappPhoneNumberId)}" />

    <label for="whatsappVerifyToken">Verify Token (cópialo al configurar el webhook en Meta)</label>
    <input class="verify-token" type="text" id="whatsappVerifyToken" name="whatsappVerifyToken" value="${escapeHtml(settings.whatsappVerifyToken)}" />

    <button type="submit">Guardar</button>
  </form>
</body>
</html>`;
}
