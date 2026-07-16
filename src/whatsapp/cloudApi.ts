import { config } from "../config";

function apiUrl(path: string): string {
  return `https://graph.facebook.com/${config.whatsappApiVersion}/${path}`;
}

async function callGraphApi(body: Record<string, unknown>): Promise<void> {
  const response = await fetch(apiUrl(`${config.whatsappPhoneNumberId}/messages`), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.whatsappToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ messaging_product: "whatsapp", ...body }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`WhatsApp Graph API respondió ${response.status}: ${errorBody}`);
  }
}

export function sendTextMessage(to: string, text: string): Promise<void> {
  return callGraphApi({
    to,
    type: "text",
    text: { body: text },
  });
}

export function markAsRead(messageId: string): Promise<void> {
  return callGraphApi({
    status: "read",
    message_id: messageId,
  });
}
