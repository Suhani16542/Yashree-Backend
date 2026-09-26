import { Router, Request, Response } from 'express';
import { authRoutes } from '../modules/auth/auth.routes.js';
import { inquiryRoutes } from '../modules/inquiries/inquiry.routes.js';
import { internshipRoutes } from '../modules/internships/internship.routes.js';
import { eventRoutes } from '../modules/events/event.routes.js';
import { galleryRoutes } from '../modules/gallery/gallery.routes.js';
import { academyVideoRoutes } from '../modules/academy-videos/academyVideo.routes.js';
import { sendSuccess } from '../utils/apiResponse.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req: Request, res: Response) => {
  sendSuccess({
    res,
    statusCode: 200,
    message: 'Yashree Backend is running',
  });
});

// Module routes
router.use('/auth', authRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/internships', internshipRoutes);
router.use('/events', eventRoutes);
router.use('/gallery', galleryRoutes);
router.use('/academy-videos', academyVideoRoutes);

export const apiRouter = router;
