import { env } from '../../config/env.js';

export interface BrevoConfig {
  apiKey: string;
  senderEmail: string;
  senderName: string;
  notificationEmail: string;
}

export const getBrevoConfig = (): BrevoConfig => ({
  apiKey: env.BREVO_API_KEY,
  senderEmail: env.BREVO_SENDER_EMAIL,
  senderName: env.BREVO_SENDER_NAME,
  notificationEmail: env.NOTIFICATION_EMAIL || env.ADMIN_EMAIL || '',
});

export const isBrevoConfigured = (): boolean => {
  const config = getBrevoConfig();
  return Boolean(config.apiKey && config.senderEmail && config.notificationEmail);
};
