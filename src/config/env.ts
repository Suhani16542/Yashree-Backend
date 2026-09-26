import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform((val) => parseInt(val, 10)),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().optional().default(''),
  JWT_SECRET: z.string().default('super_secret_jwt_key_yashree_academy_2026'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  COOKIE_SECURE: z
    .string()
    .optional()
    .transform((val) => (val === undefined ? undefined : val.toLowerCase() === 'true')),
  COOKIE_SAME_SITE: z.enum(['lax', 'strict', 'none']).default('lax'),
  ADMIN_NAME: z.string().optional(),
  ADMIN_EMAIL: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),

  // Storage Settings
  STORAGE_PROVIDER: z.enum(['local', 'cloudinary']).default('local'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // WhatsApp Notification Settings (Twilio WhatsApp API)
  WHATSAPP_ENABLED: z
    .string()
    .optional()
    .default('false')
    .transform((val) => val.toLowerCase() === 'true'),
  TWILIO_ACCOUNT_SID: z.string().optional().default(''),
  TWILIO_AUTH_TOKEN: z.string().optional().default(''),
  TWILIO_WHATSAPP_FROM: z.string().optional().default(''),
  WHATSAPP_RECIPIENT_NUMBER: z.string().optional().default(''),

  // Brevo Email Notification Settings
  BREVO_API_KEY: z.string().optional().default(''),
  BREVO_SENDER_EMAIL: z.string().optional().default(''),
  BREVO_SENDER_NAME: z.string().optional().default('Yashree Institute'),
  NOTIFICATION_EMAIL: z.string().optional().default(''),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment configuration:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
