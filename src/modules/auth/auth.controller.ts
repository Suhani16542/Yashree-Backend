import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service.js';
import { sendSuccess } from '../../utils/apiResponse.js';
import { env } from '../../config/env.js';

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.login(req.body);

      const isSecure = env.COOKIE_SECURE !== undefined ? env.COOKIE_SECURE : env.NODE_ENV === 'production';
      const sameSite = env.COOKIE_SAME_SITE || (env.NODE_ENV === 'production' ? 'none' : 'lax');

      // Set secure HTTP-only cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: sameSite as 'lax' | 'strict' | 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Admin login successful',
        data: {
          user: result.user,
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.userId;
      const user = await AuthService.getMe(userId);

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Admin profile retrieved successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isSecure = env.COOKIE_SECURE !== undefined ? env.COOKIE_SECURE : env.NODE_ENV === 'production';
      const sameSite = env.COOKIE_SAME_SITE || (env.NODE_ENV === 'production' ? 'none' : 'lax');

      res.clearCookie('token', {
        httpOnly: true,
        secure: isSecure,
        sameSite: sameSite as 'lax' | 'strict' | 'none',
      });

      sendSuccess({
        res,
        statusCode: 200,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

