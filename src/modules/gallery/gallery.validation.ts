import { z } from 'zod';

export const createGalleryItemSchema = z.object({
  category: z.string().min(1, 'Category is required').max(100).trim(),
  caption: z.string().max(500, 'Caption cannot exceed 500 characters').optional().nullable(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === 'string' ? val === 'true' : (val ?? false))),
});

export const getGalleryQuerySchema = z.object({
  category: z.string().optional(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? undefined : typeof val === 'string' ? val === 'true' : val)),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 50)),
});

export type CreateGalleryItemInput = z.infer<typeof createGalleryItemSchema>;
export type GetGalleryQuery = z.infer<typeof getGalleryQuerySchema>;
