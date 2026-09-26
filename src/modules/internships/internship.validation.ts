import { z } from 'zod';

export const InternshipStatusEnum = z.enum([
  'NEW',
  'REVIEWING',
  'SHORTLISTED',
  'INTERVIEW',
  'SELECTED',
  'REJECTED',
  'CLOSED',
]);

export const createInternshipSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(100, 'Full name cannot exceed 100 characters').trim(),
  phone: z.string().min(5, 'Phone number is required').max(20, 'Phone number cannot exceed 20 characters').trim(),
  email: z.string().email('Please provide a valid email address').toLowerCase().trim(),
  city: z.string().min(1, 'City is required').max(100, 'City cannot exceed 100 characters').trim(),
  education: z.string().min(1, 'Education qualification is required').max(150, 'Education cannot exceed 150 characters').trim(),
  areaOfInterest: z.string().min(1, 'Area of interest is required').max(100, 'Area of interest cannot exceed 100 characters').trim(),
  preferredArea: z.string().min(1, 'Preferred location/area is required').max(100, 'Preferred area cannot exceed 100 characters').trim(),
  message: z.string().max(1500, 'Message cannot exceed 1500 characters').optional().nullable(),
});

export const updateInternshipStatusSchema = z.object({
  status: InternshipStatusEnum,
});

export const getInternshipsQuerySchema = z.object({
  search: z.string().optional(),
  status: InternshipStatusEnum.optional(),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
  sortBy: z.enum(['createdAt', 'fullName', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
export type UpdateInternshipStatusInput = z.infer<typeof updateInternshipStatusSchema>;
export type GetInternshipsQuery = z.infer<typeof getInternshipsQuerySchema>;
