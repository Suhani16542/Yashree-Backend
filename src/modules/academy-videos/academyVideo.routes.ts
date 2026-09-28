import { Router } from 'express';
import { AcademyVideoController } from './academyVideo.controller.js';
import { uploadAcademyMedia } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createAcademyVideoSchema,
  getAcademyVideosQuerySchema,
} from './academyVideo.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route: get videos
router.get(
  '/',
  validate({ query: getAcademyVideosQuerySchema }),
  AcademyVideoController.getAll
);

// Public route: get single video
router.get('/:id', AcademyVideoController.getById);

// Admin route: standalone direct media upload
router.post(
  '/upload',
  requireAuth,
  requireAdmin,
  uploadAcademyMedia.fields([
    { name: 'video', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]),
  AcademyVideoController.uploadMedia
);

// Admin route: add video (supports URL or uploaded video + thumbnail)
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadAcademyMedia.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]),
  validate({ body: createAcademyVideoSchema }),
  AcademyVideoController.create
);

// Admin route: delete video
router.delete('/:id', requireAuth, requireAdmin, AcademyVideoController.delete);

export const academyVideoRoutes = router;

