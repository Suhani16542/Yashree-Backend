import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title cannot exceed 200 characters').trim(),
  slug: z.string().max(250).optional(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required').max(100).trim(),
  eventDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid event date is required (ISO 8601 string or valid date format)',
  }),
  location: z.string().min(1, 'Location is required').max(200).trim(),
  published: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === 'string' ? val === 'true' : (val ?? true))),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (typeof val === 'string' ? val === 'true' : (val ?? false))),
});

export const updateEventSchema = z.object({
  title: z.string().min(1).max(200).trim().optional(),
  slug: z.string().max(250).optional(),
  description: z.string().min(1).optional(),
  category: z.string().min(1).max(100).trim().optional(),
  eventDate: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: 'Valid event date is required',
    })
    .optional(),
  location: z.string().min(1).max(200).trim().optional(),
  published: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? undefined : typeof val === 'string' ? val === 'true' : val)),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? undefined : typeof val === 'string' ? val === 'true' : val)),
});

export const getEventsQuerySchema = z.object({
  category: z.string().optional(),
  featured: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((val) => (val === undefined ? undefined : typeof val === 'string' ? val === 'true' : val)),
  page: z.string().optional().transform((val) => (val ? Math.max(1, parseInt(val, 10)) : 1)),
  limit: z.string().optional().transform((val) => (val ? Math.min(100, Math.max(1, parseInt(val, 10))) : 20)),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>;
