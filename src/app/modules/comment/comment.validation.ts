import { z } from 'zod';

const createComment = z.object({
  body: z.object({
    message: z.string({ required_error: 'message is requied' }),
    blog_id: z.string({ required_error: 'blog_id is requied' }).uuid(),
  }),
});

const updateComment = z.object({
  body: z.object({
    message: z.string({ required_error: 'message is requied' }),
  }),
});

export const CommentValidation = {
  createComment,
  updateComment,
};
