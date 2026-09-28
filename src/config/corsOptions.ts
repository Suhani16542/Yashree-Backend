import { CorsOptions } from 'cors';
import { env } from './env.js';

// Helper to sanitize origin by removing trailing slashes and whitespace
const sanitizeOrigin = (url: string): string => url.trim().replace(/\/+$/, '');

// Default allowed origins (local development + production frontend)
const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://yashree-institute-website.vercel.app',
];

const parseAllowedOrigins = (): string[] => {
  const origins = new Set<string>(defaultAllowedOrigins.map(sanitizeOrigin));

  if (env.FRONTEND_URL) {
    // Support single origin or comma-separated list of origins
    env.FRONTEND_URL.split(',').forEach((url) => {
      const sanitized = sanitizeOrigin(url);
      if (sanitized) {
        origins.add(sanitized);
      }
    });
  }

  return Array.from(origins);
};

const allowedOrigins = parseAllowedOrigins();

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    const normalizedOrigin = sanitizeOrigin(origin);

    if (allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    } else {
      return callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  optionsSuccessStatus: 200,
};
