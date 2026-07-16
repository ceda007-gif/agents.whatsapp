# agents.whatsapp

Agente de WhatsApp con inteligencia artificial. Se conecta a WhatsApp Web (vía [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js), sin necesidad de la API oficial de Meta) y responde a los mensajes usando los modelos de Claude (Anthropic).

## Características

- Conexión a WhatsApp mediante código QR (WhatsApp Web).
- Respuestas generadas con IA (Claude), con memoria de conversación por chat.
- Prompt de sistema, modelo y límites configurables por variables de entorno.
- Filtro para responder solo a ciertos chats (`ALLOWED_CHAT_IDS`) o ignorar grupos.
- Comandos básicos: `/reset` (reinicia el historial) y `/ayuda`.

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

## Estructura del proyecto

```
src/
  config.ts             Carga y valida la configuración desde .env
  conversationStore.ts  Memoria de conversación en memoria por chat
  ai.ts                 Llamadas a la API de Anthropic (Claude)
  index.ts              Cliente de WhatsApp y manejo de mensajes
```

## Notas

- Este proyecto usa WhatsApp Web de forma no oficial; úsalo conforme a los Términos de Servicio de WhatsApp.
- El historial de conversación se guarda solo en memoria del proceso; se pierde al reiniciar el agente.
