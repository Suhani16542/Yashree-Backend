import { Router } from 'express';
import { EventController } from './event.controller.js';
import { uploadEventBanner } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createEventSchema,
  updateEventSchema,
  getEventsQuerySchema,
} from './event.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

// Public endpoint: List published events
router.get('/', validate({ query: getEventsQuerySchema }), EventController.getPublic);

// Admin endpoint: List all events (including unpublished)
router.get(
  '/admin/all',
  requireAuth,
  requireAdmin,
  validate({ query: getEventsQuerySchema }),
  EventController.getAllAdmin
);

// Admin endpoint: Create event
router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadEventBanner.single('bannerImage'),
  validate({ body: createEventSchema }),
  EventController.create
);

// Admin endpoint: Update event
router.put(
  '/:id',
  requireAuth,
  requireAdmin,
  uploadEventBanner.single('bannerImage'),
  validate({ body: updateEventSchema }),
  EventController.update
);

// Admin endpoint: Delete event
router.delete('/:id', requireAuth, requireAdmin, EventController.delete);

export const eventRoutes = router;
