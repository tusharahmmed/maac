import { z } from 'zod';

const createTag = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, { message: 'Name is too short' }),
    description: z
      .string()
      .min(3, { message: 'description is too short' })
      .optional(),
  }),
});

const updateTag = z.object({
  body: z.object({
    name: z.string().min(3, { message: 'Name is too short' }).optional(),
    description: z
      .string()
      .min(3, { message: 'description is too short' })
      .optional(),
  }),
});

export const TagValidation = {
  createTag,
  updateTag,
};
