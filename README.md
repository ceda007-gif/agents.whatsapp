# agents.whatsapp

Agente de WhatsApp con inteligencia artificial. Usa la **API oficial de WhatsApp Business (Cloud API de Meta)** vía webhook — no hay riesgo de baneo por automatización, a diferencia de librerías no oficiales tipo WhatsApp Web. Responde a los mensajes usando IA generativa (Google Gemini o Claude de Anthropic, intercambiables).

## Características

- Integración oficial con la **WhatsApp Cloud API** de Meta (webhook HTTP, sin QR ni sesión de navegador).
- Respuestas generadas con IA, con memoria de conversación por chat. Soporta **Gemini** (Google) o **Claude** (Anthropic) como proveedor, elegible por variable de entorno.
- Prompt de sistema, modelo y límites configurables por variables de entorno.
- Filtro para responder solo a ciertos números (`ALLOWED_CHAT_IDS`).
- Comandos básicos: `/reset` (reinicia el historial) y `/ayuda`.
- Límites de envío configurables para controlar costos y evitar respuestas en ráfaga (ver más abajo).

## Requisitos

- Node.js 18 o superior.
- Una clave de API del proveedor de IA que uses:
  - Gemini (por defecto, tiene nivel gratuito): [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
  - Anthropic/Claude (opcional): [console.anthropic.com](https://console.anthropic.com/)
- Una cuenta de **Meta for Developers** con una app de WhatsApp Business (ver siguiente sección).

## Configuración en Meta for Developers (número de prueba)

Para desarrollar/probar, Meta te da un **número de prueba gratuito** que puede mandar mensajes a hasta 5 números verificados por ti — no necesitas verificación de negocio para esto.

1. Entra a [developers.facebook.com](https://developers.facebook.com/) y crea una cuenta de desarrollador si no tienes.
2. **Mis apps → Crear app** → tipo "Otro" → "Empresa". Ponle un nombre.
3. Dentro de la app, agrega el producto **WhatsApp**.
4. En **WhatsApp → Introducción** vas a ver:
   - Un **número de teléfono de prueba** ya asignado (gratis).
   - Su **Phone Number ID** (cópialo, es `WHATSAPP_PHONE_NUMBER_ID`).
   - Un **token de acceso temporal** (dura 24h; luego genera uno permanente en **Configuración de la app → Usuarios del sistema**, o usa el de la app mientras pruebas). Es `WHATSAPP_TOKEN`.
5. En la misma pantalla, agrega **tu propio número de WhatsApp** como destinatario de prueba (te llega un código por WhatsApp para verificarlo). Así puedes mandarte mensajes de prueba a ti mismo.
6. En **WhatsApp → Configuración → Webhooks**, vas a configurar la URL de tu webhook (`https://tu-dominio-o-túnel/webhook`) y un **Verify Token** — cualquier string secreto que tú inventes y pongas también en `WHATSAPP_VERIFY_TOKEN`. Suscríbete al campo `messages`.

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env`:
- `AI_PROVIDER` (`gemini` o `anthropic`) y la clave correspondiente (`GEMINI_API_KEY` o `ANTHROPIC_API_KEY`).
- `WHATSAPP_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN` obtenidos arriba.

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

El servidor levanta en `PORT` (por defecto `3000`) y expone `GET/POST /webhook`.

### Probar localmente con un túnel (ngrok)

Meta necesita llamar a tu webhook por HTTPS público, así que si corres el bot en tu computadora necesitas exponerlo con un túnel, por ejemplo [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Copia la URL `https://xxxx.ngrok-free.app/webhook` y ponla en **WhatsApp → Configuración → Webhooks** en Meta for Developers, junto con tu `WHATSAPP_VERIFY_TOKEN`. Meta hará una petición `GET` de verificación antes de aceptarla.

Una vez configurado, manda un WhatsApp al número de prueba desde el teléfono que verificaste como destinatario — el bot debería responder.

## Variables de entorno

| Variable | Descripción | Por defecto |
| --- | --- | --- |
| `AI_PROVIDER` | Proveedor de IA: `gemini` o `anthropic` | `gemini` |
| `GEMINI_API_KEY` | Clave de API de Gemini (requerida si `AI_PROVIDER=gemini`) | — |
| `ANTHROPIC_API_KEY` | Clave de API de Anthropic (requerida si `AI_PROVIDER=anthropic`) | — |
| `AI_MODEL` | Modelo a usar | `gemini-3.1-flash-lite` o `claude-sonnet-5` según el proveedor |
| `SYSTEM_PROMPT` | Prompt de sistema / personalidad del agente | Asistente genérico |
| `MAX_HISTORY_MESSAGES` | Mensajes de historial que se conservan por chat | `20` |
| `MAX_OUTPUT_TOKENS` | Tokens máximos por respuesta | `1024` |
| `ALLOWED_CHAT_IDS` | Números permitidos, separados por coma (vacío = todos) | `` |
| `COMMAND_PREFIX` | Prefijo de comandos | `/` |
| `WHATSAPP_TOKEN` | Token de acceso de tu app de Meta (requerido) | — |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone Number ID del número de prueba o real (requerido) | — |
| `WHATSAPP_VERIFY_TOKEN` | Secreto para la verificación del webhook (requerido, lo inventas tú) | — |
| `WHATSAPP_API_VERSION` | Versión de la Graph API de Meta | `v23.0` |
| `PORT` | Puerto del servidor del webhook | `3000` |
| `MIN_REPLY_DELAY_MS` / `MAX_REPLY_DELAY_MS` | Rango de delay antes de enviar cada respuesta | `1500` / `6000` |
| `MIN_MESSAGE_INTERVAL_MS` | Espaciado mínimo entre dos mensajes salientes cualesquiera | `2500` |
| `MAX_MESSAGES_PER_CHAT_WINDOW` | Máximo de respuestas de IA por chat en la ventana de tiempo | `8` |
| `CHAT_RATE_WINDOW_MS` | Duración de la ventana para el límite anterior (ms) | `300000` (5 min) |

## Estructura del proyecto

```
src/
  config.ts                  Carga y valida la configuración desde .env
  conversationStore.ts       Memoria de conversación en memoria por chat
  ai/
    index.ts                 Selecciona el proveedor de IA según AI_PROVIDER
    geminiProvider.ts         Llamadas a la API de Google Gemini
    anthropicProvider.ts      Llamadas a la API de Anthropic (Claude)
  whatsapp/
    cloudApi.ts               Envío de mensajes y marcado de leído vía Graph API
    webhookTypes.ts            Tipos del payload del webhook de Meta
  rateLimiter.ts              Delay antes de responder, espaciado global y límite por chat
  index.ts                    Servidor Express: webhook y orquestación de mensajes
```

## Proveedores de IA: Gemini vs. Claude

Por defecto el bot usa **Gemini** (`gemini-3.1-flash-lite`), que tiene un **nivel gratuito** en la API de Google — pero "gratis" no significa ilimitado: tiene límites de velocidad (peticiones por minuto y por día), no una cuota de créditos que se recarga. Para un negocio pequeño (cientos a un par de miles de conversaciones al mes) normalmente es suficiente y el costo es $0, siempre que no tengas picos de más de ~15-30 mensajes en el mismo minuto.

Ten en cuenta:

- En el nivel gratuito de Gemini, Google puede usar tus prompts para mejorar sus productos (a diferencia del nivel de pago). Si vas a mandar datos sensibles de clientes, revisa la [política de datos de Gemini API](https://ai.google.dev/gemini-api/terms) antes de usarlo en producción.
- Si tu volumen crece o quieres mejor calidad de respuesta, puedes cambiar a `AI_MODEL=gemini-3.1-pro-preview` (de paga) o a `AI_PROVIDER=anthropic` (Claude) en cualquier momento — es solo una variable de entorno, el código no cambia.
- Los límites exactos de la API gratuita de Gemini cambian con el tiempo; confirma los vigentes en [ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits) antes de lanzar a producción.

## Costos y límites de envío

Al usar la API oficial, los mensajes se facturan según las tarifas de Meta (ver conversación del proyecto para el desglose de categorías y estimado según tu volumen) — no hay riesgo de baneo, pero sí costo por mensaje fuera de la ventana de servicio gratuita de 24h.

El bot igual incluye límites configurables para controlar costos y evitar comportamientos indeseados:

- **Delay antes de responder** (`MIN_REPLY_DELAY_MS` / `MAX_REPLY_DELAY_MS`).
- **Espaciado mínimo global** entre mensajes salientes (`MIN_MESSAGE_INTERVAL_MS`).
- **Límite por chat** (`MAX_MESSAGES_PER_CHAT_WINDOW` / `CHAT_RATE_WINDOW_MS`): si un chat supera el límite en la ventana configurada, el bot deja de responderle temporalmente (se loguea en consola) — útil para cortar loops o abuso antes de que generen costo.

## Pasar a producción

Antes de usarlo con clientes reales de forma continua:

- Necesitas un servidor con URL pública estable (no un túnel de ngrok) — cualquier VPS pequeño sirve, corriendo el proceso con `pm2` o `systemd` para que se reinicie solo si falla.
- Para pasar del número de prueba a tu número de negocio real, Meta requiere verificar el negocio (Business Verification) en el Meta Business Manager.
- Genera un **token de acceso permanente** (no el temporal de 24h) desde un Usuario del Sistema en la configuración de la app.

## Notas

- El historial de conversación se guarda solo en memoria del proceso; se pierde al reiniciar el agente.
