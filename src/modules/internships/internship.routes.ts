import { Router } from 'express';
import { InternshipController } from './internship.controller.js';
import { uploadResume } from '../../middlewares/upload.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createInternshipSchema,
  updateInternshipStatusSchema,
  getInternshipsQuerySchema,
} from './internship.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { submissionLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

// Public submission route
router.post(
  '/',
  submissionLimiter,
  uploadResume.single('resume'),
  validate({ body: createInternshipSchema }),
  InternshipController.create
);

// Admin routes
router.get(
  '/',
  requireAuth,
  requireAdmin,
  validate({ query: getInternshipsQuerySchema }),
  InternshipController.getAll
);

router.get('/:id', requireAuth, requireAdmin, InternshipController.getById);

router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validate({ body: updateInternshipStatusSchema }),
  InternshipController.updateStatus
);

router.delete('/:id', requireAuth, requireAdmin, InternshipController.delete);

// Admin protected resume download
router.get('/:id/resume', requireAuth, requireAdmin, InternshipController.downloadResume);

export const internshipRoutes = router;
