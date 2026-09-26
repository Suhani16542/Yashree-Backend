import { Router } from 'express';
import { GalleryController } from './gallery.controller.js';
import { uploadGalleryImage } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createGalleryItemSchema,
  getGalleryQuerySchema,
} from './gallery.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public route: get gallery items
router.get('/', validate({ query: getGalleryQuerySchema }), GalleryController.getAll);

// Admin route: upload gallery item
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadGalleryImage.single('image'),
  validate({ body: createGalleryItemSchema }),
  GalleryController.create
);

// Admin route: delete gallery item
router.delete('/:id', requireAuth, requireAdmin, GalleryController.delete);

export const galleryRoutes = router;
