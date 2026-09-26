import { env } from '../../config/env.js';

export interface WhatsAppConfig {
  enabled: boolean;
  accountSid: string;
  authToken: string;
  fromNumber: string;
  recipientNumber: string;
}

export const getWhatsAppConfig = (): WhatsAppConfig => ({
  enabled: env.WHATSAPP_ENABLED,
  accountSid: env.TWILIO_ACCOUNT_SID,
  authToken: env.TWILIO_AUTH_TOKEN,
  fromNumber: env.TWILIO_WHATSAPP_FROM,
  recipientNumber: env.WHATSAPP_RECIPIENT_NUMBER,
});

/**
 * Normalizes phone numbers to standard Twilio WhatsApp format (whatsapp:+<E.164>)
 * Handles inputs with or without '+' or 'whatsapp:' prefix, and cleans spaces/dashes.
 */
export const formatWhatsAppNumber = (rawPhone: string): string => {
  if (!rawPhone) return '';

  let cleaned = rawPhone.trim();

  // If it already has the 'whatsapp:' prefix, check the inner number
  if (cleaned.startsWith('whatsapp:')) {
    const inner = cleaned.replace(/^whatsapp:/, '').trim();
    const sanitizedInner = inner.startsWith('+')
      ? '+' + inner.slice(1).replace(/[^0-9]/g, '')
      : '+' + inner.replace(/[^0-9]/g, '');
    return `whatsapp:${sanitizedInner}`;
  }

  // Sanitize digits, ensuring a leading +
  if (cleaned.startsWith('+')) {
    cleaned = '+' + cleaned.slice(1).replace(/[^0-9]/g, '');
  } else {
    cleaned = '+' + cleaned.replace(/[^0-9]/g, '');
  }

  return `whatsapp:${cleaned}`;
};

export const isWhatsAppConfigured = (): boolean => {
  const config = getWhatsAppConfig();
  return Boolean(
    config.enabled &&
      config.accountSid &&
      config.authToken &&
      config.fromNumber &&
      config.recipientNumber
  );
};
