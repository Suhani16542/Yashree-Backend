import express, { Express } from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { corsOptions } from './config/corsOptions.js';
import { apiLimiter } from './middlewares/rateLimiter.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { apiRouter } from './routes/index.js';

const app: Express = express();

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// CORS configuration
app.use(cors(corsOptions));

// HTTP request logger
if (env.NODE_ENV !== 'test') {
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// Request Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply global rate limiting to all API routes
app.use('/api/', apiLimiter);

// Serve public uploads safely (gallery, events, video thumbnails)
// Note: uploads/resumes is private and ONLY accessible via protected admin endpoint
app.use('/uploads/gallery', express.static(path.join(process.cwd(), 'uploads', 'gallery')));
app.use('/uploads/events', express.static(path.join(process.cwd(), 'uploads', 'events')));
app.use('/uploads/videos', express.static(path.join(process.cwd(), 'uploads', 'videos')));

// Root & Health route shortcuts
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Yashree Institute of Cosmetology & Aesthetic Academy API',
    docs: '/api/v1/health',
  });
});

// API v1 routes
app.use('/api/v1', apiRouter);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
