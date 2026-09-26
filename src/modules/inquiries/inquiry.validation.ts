import { z } from 'zod';

export const InquiryStatusEnum = z.enum([
  'NEW',
  'CONTACTED',
  'FOLLOW_UP',
  'CONVERTED',
  'CLOSED',
]);

export const createInquirySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters').trim(),
  phone: z.string().min(5, 'Phone number is required').max(20, 'Phone number cannot exceed 20 characters').trim(),
  course: z.string().min(1, 'Course is required').max(150, 'Course cannot exceed 150 characters').trim(),
  mode: z.string().min(1, 'Mode of study is required').max(50, 'Mode cannot exceed 50 characters').trim(),
  message: z.string().max(1000, 'Message cannot exceed 1000 characters').optional().nullable(),
});

export const updateInquiryStatusSchema = z.object({
  status: InquiryStatusEnum,
});

export const getInquiriesQuerySchema = z.object({
  search: z.string().optional(),
  status: InquiryStatusEnum.optional(),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
  sortBy: z.enum(['createdAt', 'name', 'status']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type UpdateInquiryStatusInput = z.infer<typeof updateInquiryStatusSchema>;
export type GetInquiriesQuery = z.infer<typeof getInquiriesQuerySchema>;
