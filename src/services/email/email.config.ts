import { env } from '../../config/env.js';

export interface BrevoConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  notificationEmail: string;
  notificationEmails: string[];
}

/**
 * Parses comma-separated notification email string into a clean, validated array of email addresses.
 * Handles single email, multiple comma-separated emails, trims whitespace, and ignores empty/invalid items.
 */
export const parseNotificationEmails = (rawEmail?: string): string[] => {
  if (!rawEmail || typeof rawEmail !== 'string') return [];
  return rawEmail
    .split(',')
    .map((e) => e.trim())
    .filter((e) => e.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
};

export const getBrevoConfig = (): BrevoConfig => {
  const rawNotification = env.NOTIFICATION_EMAIL || env.ADMIN_EMAIL || '';
  const notificationEmails = parseNotificationEmails(rawNotification);

  return {
    apiKey: env.BREVO_API_KEY,
    senderEmail: env.BREVO_SENDER_EMAIL,
    senderName: env.BREVO_SENDER_NAME,
    notificationEmail: rawNotification,
    notificationEmails,
  };
};

export const isBrevoConfigured = (): boolean => {
  const config = getBrevoConfig();
  return Boolean(config.apiKey && config.senderEmail && config.notificationEmails.length > 0);
};
