# agents.whatsapp

Agente de WhatsApp con inteligencia artificial. Usa la **API oficial de WhatsApp Business (Cloud API de Meta)** vía webhook — no hay riesgo de baneo por automatización, a diferencia de librerías no oficiales tipo WhatsApp Web. Responde a los mensajes usando IA generativa (Google Gemini o Claude de Anthropic, intercambiables).

## Características

- Integración oficial con la **WhatsApp Cloud API** de Meta (webhook HTTP, sin QR ni sesión de navegador).
- **Panel web `/admin`** para configurar todo (token de WhatsApp, API key de IA, info del negocio) sin editar archivos ni usar la terminal, protegido con contraseña.
- Respuestas generadas con IA, con memoria de conversación por chat. Soporta **Gemini** (Google) o **Claude** (Anthropic) como proveedor, elegible desde el panel.
- Prompt de sistema, modelo y límites configurables.
- Filtro para responder solo a ciertos números (`ALLOWED_CHAT_IDS`).
- Comandos básicos: `/reset` (reinicia el historial) y `/ayuda`.
- Límites de envío configurables para controlar costos y evitar respuestas en ráfaga (ver más abajo).

## Requisitos

- Node.js 18 o superior.
- Una clave de API del proveedor de IA que uses (se ingresa desde el panel `/admin`, no hace falta tenerla antes de instalar):
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
   - Su **Phone Number ID** (lo vas a pegar en el panel `/admin` del bot).
   - Un **token de acceso temporal** (dura 24h; luego genera uno permanente en **Configuración de la app → Usuarios del sistema**, o usa el de la app mientras pruebas). También va en el panel.
5. En la misma pantalla, agrega **tu propio número de WhatsApp** como destinatario de prueba (te llega un código por WhatsApp para verificarlo). Así puedes mandarte mensajes de prueba a ti mismo.
6. En **WhatsApp → Configuración → Webhooks**, vas a configurar la URL de tu webhook (`https://tu-dominio-o-túnel/webhook`) y un **Verify Token**. El bot ya genera uno automáticamente la primera vez que arranca — lo vas a ver en el panel `/admin` para copiarlo ahí. Suscríbete al campo `messages`.

## Instalación

```bash
npm install
cp .env.example .env
```

Edita `.env` y define **solo** `ADMIN_PASSWORD` (la contraseña para entrar al panel — invéntala tú). Es la única variable obligatoria; el resto se configura después desde la web.

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

El servidor levanta en `PORT` (por defecto `3000`) y expone:
- `GET/POST /webhook` — lo usa Meta, no lo tocas tú.
- `GET /admin` — el panel de configuración (pide la contraseña `ADMIN_PASSWORD` con el login del navegador).

### Configurar el bot desde el panel

1. Entra a `http://localhost:3000/admin` (o la URL pública del servidor) y pon la contraseña.
2. Llena: proveedor de IA + su API key, la información/personalidad de tu negocio, y el token + Phone Number ID de WhatsApp que obtuviste en Meta for Developers.
3. Copia el **Verify Token** que aparece ya generado en el panel y pégalo en la configuración del webhook en Meta.
4. Dale **Guardar** — los cambios aplican al instante, sin reiniciar el servidor.

Los campos de contraseñas/tokens se muestran vacíos por seguridad (solo indican si ya hay algo guardado); si los dejas en blanco al guardar, se conserva el valor anterior.

### Probar localmente con un túnel (ngrok)

Meta necesita llamar a tu webhook por HTTPS público, así que si corres el bot en tu computadora necesitas exponerlo con un túnel, por ejemplo [ngrok](https://ngrok.com/):

```bash
ngrok http 3000
```

Copia la URL `https://xxxx.ngrok-free.app/webhook` y ponla en **WhatsApp → Configuración → Webhooks** en Meta for Developers, junto con el Verify Token que copiaste del panel `/admin`. Meta hará una petición `GET` de verificación antes de aceptarla.

Una vez configurado, manda un WhatsApp al número de prueba desde el teléfono que verificaste como destinatario — el bot debería responder.

## Configuración editable desde `/admin` (no va en `.env`)

Estos valores se guardan en `data/settings.json` (no se commitea, tiene secretos) al llenarlos en el panel:

| Campo en el panel | Para qué es |
| --- | --- |
| Proveedor de IA | `gemini` o `anthropic` |
| Gemini / Anthropic API Key | Según el proveedor elegido |
| Modelo (opcional) | Override del modelo por defecto |
| Información del negocio | El prompt de sistema / personalidad del bot |
| Token de acceso de WhatsApp | El de tu app en Meta for Developers |
| Phone Number ID | El del número de prueba o real |
| Verify Token | Autogenerado; se copia en la config del webhook en Meta |

Si vienes de una versión anterior con estos valores en `.env`, se usan como semilla inicial la primera vez que arranca (después el panel manda).

## Variables de entorno (`.env`)

| Variable | Descripción | Por defecto |
| --- | --- | --- |
| `ADMIN_PASSWORD` | Contraseña del panel `/admin` (**requerida**, la inventas tú) | — |
| `MAX_HISTORY_MESSAGES` | Mensajes de historial que se conservan por chat | `20` |
| `MAX_OUTPUT_TOKENS` | Tokens máximos por respuesta | `1024` |
| `ALLOWED_CHAT_IDS` | Números permitidos, separados por coma (vacío = todos) | `` |
| `COMMAND_PREFIX` | Prefijo de comandos | `/` |
| `WHATSAPP_API_VERSION` | Versión de la Graph API de Meta | `v23.0` |
| `PORT` | Puerto del servidor (webhook + panel) | `3000` |
| `MIN_REPLY_DELAY_MS` / `MAX_REPLY_DELAY_MS` | Rango de delay antes de enviar cada respuesta | `1500` / `6000` |
| `MIN_MESSAGE_INTERVAL_MS` | Espaciado mínimo entre dos mensajes salientes cualesquiera | `2500` |
| `MAX_MESSAGES_PER_CHAT_WINDOW` | Máximo de respuestas de IA por chat en la ventana de tiempo | `8` |
| `CHAT_RATE_WINDOW_MS` | Duración de la ventana para el límite anterior (ms) | `300000` (5 min) |

## Estructura del proyecto

```
src/
  config.ts                  Config de infraestructura desde .env (no editable por la web)
  settings.ts                 Config editable en runtime, persistida en data/settings.json
  conversationStore.ts       Memoria de conversación en memoria por chat
  ai/
    index.ts                 Selecciona el proveedor de IA según settings.aiProvider
    geminiProvider.ts         Llamadas a la API de Google Gemini
    anthropicProvider.ts      Llamadas a la API de Anthropic (Claude)
  whatsapp/
    cloudApi.ts               Envío de mensajes y marcado de leído vía Graph API
    webhookTypes.ts            Tipos del payload del webhook de Meta
  admin/
    auth.ts                   Middleware de HTTP Basic Auth para /admin
    template.ts                HTML del panel de configuración
  rateLimiter.ts              Delay antes de responder, espaciado global y límite por chat
  index.ts                    Servidor Express: webhook, panel /admin y orquestación de mensajes
```

## Proveedores de IA: Gemini vs. Claude

Por defecto el bot usa **Gemini** (`gemini-3.1-flash-lite`), que tiene un **nivel gratuito** en la API de Google — pero "gratis" no significa ilimitado: tiene límites de velocidad (peticiones por minuto y por día), no una cuota de créditos que se recarga. Para un negocio pequeño (cientos a un par de miles de conversaciones al mes) normalmente es suficiente y el costo es $0, siempre que no tengas picos de más de ~15-30 mensajes en el mismo minuto.

Ten en cuenta:

- En el nivel gratuito de Gemini, Google puede usar tus prompts para mejorar sus productos (a diferencia del nivel de pago). Si vas a mandar datos sensibles de clientes, revisa la [política de datos de Gemini API](https://ai.google.dev/gemini-api/terms) antes de usarlo en producción.
- Si tu volumen crece o quieres mejor calidad de respuesta, puedes poner `gemini-3.1-pro-preview` como modelo (de paga) o cambiar a Claude en cualquier momento — es solo cambiar el desplegable y guardar en el panel, el código no cambia.
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
- La carpeta `data/` (donde vive `settings.json`, lo que llenas en el panel) debe estar en **disco persistente** — en plataformas con sistema de archivos efímero (algunos hostings "serverless"), esa carpeta se borra en cada despliegue y tendrías que reconfigurar el panel cada vez.
- Para pasar del número de prueba a tu número de negocio real, Meta requiere verificar el negocio (Business Verification) en el Meta Business Manager.
- Genera un **token de acceso permanente** (no el temporal de 24h) desde un Usuario del Sistema en la configuración de la app, y ponlo en el panel.

## Notas

- El historial de conversación se guarda solo en memoria del proceso; se pierde al reiniciar el agente.
- La configuración del panel (`data/settings.json`) sí sobrevive reinicios, siempre que el disco sea persistente (ver "Pasar a producción").
- El panel `/admin` usa HTTP Basic Auth: al entrar, el navegador pide usuario y contraseña — el usuario puede ser cualquier texto, solo se valida la contraseña (`ADMIN_PASSWORD`).
