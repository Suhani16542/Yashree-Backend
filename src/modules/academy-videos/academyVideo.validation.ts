import { z } from 'zod';

export const createAcademyVideoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  videoUrl: z.string().trim().optional(),
  category: z.string().min(1, 'Category is required').max(100).trim(),
  description: z.string().max(2000).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
  thumbnailUrl: z.string().optional().nullable(),
  videoSource: z.enum(['youtube', 'upload']).optional(),
  videoType: z.enum(['youtube', 'upload']).optional(),
  published: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === 'string' ? val === 'true' : (val ?? true))),
});

export const getAcademyVideosQuerySchema = z.object({
  category: z.string().optional(),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 50)),
});

export type CreateAcademyVideoInput = z.infer<typeof createAcademyVideoSchema>;
export type GetAcademyVideosQuery = z.infer<typeof getAcademyVideosQuerySchema>;

