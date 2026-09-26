import { Router } from 'express';
import { AuthController } from './auth.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { loginSchema } from './auth.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { authLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

router.post(
  '/login',
  authLimiter,
  validate({ body: loginSchema }),
  AuthController.login
);

router.get('/me', requireAuth, AuthController.getMe);
router.post('/logout', AuthController.logout);

export const authRoutes = router;

