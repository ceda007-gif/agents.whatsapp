# agents.whatsapp

Agente de WhatsApp con inteligencia artificial. Se conecta a WhatsApp Web (vía [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), sin necesidad de la API oficial de Meta) y responde a los mensajes usando los modelos de Claude (Anthropic).

## Características

- Conexión a WhatsApp mediante código QR (WhatsApp Web).
- Respuestas generadas con IA (Claude), con memoria de conversación por chat.
- Prompt de sistema, modelo y límites configurables por variables de entorno.
- Filtro para responder solo a ciertos chats (`ALLOWED_CHAT_IDS`) o ignorar grupos.
- Comandos básicos: `/reset` (reinicia el historial) y `/ayuda`.
- Mitigaciones para reducir el riesgo de que WhatsApp marque el número como spam/bot (ver más abajo).

## Requisitos

- Node.js 18 o superior.
- Una clave de API de Anthropic ([console.anthropic.com](https://console.anthropic.com/)).
- Un número de WhatsApp para vincular como dispositivo.

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` y define al menos `ANTHROPIC_API_KEY`.

## Uso

Modo desarrollo (recarga automática):

```bash
npm run dev
```

Modo producción:

```bash
npm run build
npm start
```

Al iniciar, se mostrará un código QR en la terminal. Escanéalo desde WhatsApp en **Configuración → Dispositivos vinculados → Vincular un dispositivo**. La sesión se guarda en `.wwebjs_auth/` para no tener que escanear el QR en cada inicio.

## Variables de entorno

| Variable | Descripción | Por defecto |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Clave de API de Anthropic (requerida) | — |
| `CLAUDE_MODEL` | Modelo de Claude a usar | `claude-sonnet-5` |
| `SYSTEM_PROMPT` | Prompt de sistema / personalidad del agente | Asistente genérico |
| `MAX_HISTORY_MESSAGES` | Mensajes de historial que se conservan por chat | `20` |
| `MAX_OUTPUT_TOKENS` | Tokens máximos por respuesta | `1024` |
| `ALLOWED_CHAT_IDS` | IDs de chat permitidos, separados por coma (vacío = todos) | `` |
| `RESPOND_TO_GROUPS` | Responder también en grupos (`true`/`false`) | `false` |
| `COMMAND_PREFIX` | Prefijo de comandos | `/` |
| `CHROME_EXECUTABLE_PATH` | Ruta a un binario de Chromium ya instalado | Chromium empaquetado por Puppeteer |
| `MIN_REPLY_DELAY_MS` / `MAX_REPLY_DELAY_MS` | Rango de delay "humano" antes de enviar cada respuesta | `1500` / `6000` |
| `MIN_MESSAGE_INTERVAL_MS` | Espaciado mínimo entre dos mensajes salientes cualesquiera | `2500` |
| `MAX_MESSAGES_PER_CHAT_WINDOW` | Máximo de respuestas de IA por chat en la ventana de tiempo | `8` |
| `CHAT_RATE_WINDOW_MS` | Duración de la ventana para el límite anterior (ms) | `300000` (5 min) |

## Estructura del proyecto

```
src/
  config.ts             Carga y valida la configuración desde .env
  conversationStore.ts  Memoria de conversación en memoria por chat
  ai.ts                 Llamadas a la API de Anthropic (Claude)
  rateLimiter.ts         Delay tipo humano, espaciado global y límite por chat
  index.ts              Cliente de WhatsApp y manejo de mensajes
```

## Riesgo de baneo del número

`whatsapp-web.js` usa WhatsApp Web de forma no oficial (no es la API Business de Meta), y WhatsApp puede banear números que detecte como automatizados. Este proyecto incluye mitigaciones para reducir ese riesgo:

- **Delay tipo humano** antes de cada respuesta (`MIN_REPLY_DELAY_MS` / `MAX_REPLY_DELAY_MS`), con indicador de "escribiendo...".
- **Espaciado mínimo global** entre cualquier par de mensajes salientes (`MIN_MESSAGE_INTERVAL_MS`), para evitar ráfagas si llegan varios mensajes a la vez.
- **Límite por chat** (`MAX_MESSAGES_PER_CHAT_WINDOW` / `CHAT_RATE_WINDOW_MS`): si un chat supera el límite en la ventana configurada, el bot deja de responderle temporalmente (se loguea en consola).
- El bot **solo responde a mensajes entrantes**, nunca envía mensajes no solicitados ni hace difusión masiva.

Recomendaciones adicionales para uso en negocio:

- Usa un número dedicado para el bot, no el número personal del dueño del negocio.
- Mantén los límites conservadores mientras validas el comportamiento; súbelos gradualmente si el volumen lo requiere.
- Si el volumen de mensajes crece o esto pasa a ser crítico para el negocio, considera migrar a la **API oficial de WhatsApp Business** (Meta directamente o vía proveedores como Twilio/360dialog), que no tiene riesgo de baneo por automatización.

## Notas

- Este proyecto usa WhatsApp Web de forma no oficial; úsalo conforme a los Términos de Servicio de WhatsApp.
- El historial de conversación se guarda solo en memoria del proceso; se pierde al reiniciar el agente.
