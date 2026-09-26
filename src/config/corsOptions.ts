import { CorsOptions } from 'cors';
import { env } from './env.js';

const allowedOrigins: string[] = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

if (env.FRONTEND_URL && !allowedOrigins.includes(env.FRONTEND_URL)) {
  allowedOrigins.push(env.FRONTEND_URL);
}

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
