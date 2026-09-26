import { Router } from 'express';
import { InquiryController } from './inquiry.controller.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createInquirySchema,
  updateInquiryStatusSchema,
  getInquiriesQuerySchema,
} from './inquiry.validation.js';
import { requireAuth, requireAdmin } from '../../middlewares/auth.middleware.js';
import { submissionLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();

// Public route for enquiry submission
router.post(
  '/',
  submissionLimiter,
  validate({ body: createInquirySchema }),
  InquiryController.create
);

// Admin routes
router.get(
  '/',
  requireAuth,
  requireAdmin,
  validate({ query: getInquiriesQuerySchema }),
  InquiryController.getAll
);

router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validate({ body: updateInquiryStatusSchema }),
  InquiryController.updateStatus
);

router.delete('/:id', requireAuth, requireAdmin, InquiryController.delete);

export const inquiryRoutes = router;
