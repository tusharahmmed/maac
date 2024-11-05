import { z } from 'zod';

const createBlog = z.object({
  body: z.object({
    name: z.string({ required_error: 'name is required' }).min(3),
    description: z.string({ required_error: 'description is required' }).min(5),
    tags: z.string({ required_error: 'tags is required' }).uuid().array(),
  }),
});

const updateBlog = z.object({
  body: z.object({
    name: z.string().min(3).optional(),
    description: z.string().min(5).optional(),
    status: z.boolean().optional(),
    tags: z.string().uuid().array().optional(),
  }),
});

export const BlogValidation = {
  createBlog,
  updateBlog,
};
