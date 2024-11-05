import { USER_ROLE } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { CommentController } from './comment.controller';
import { CommentValidation } from './comment.validation';

const router = Router();

router.post(
  '/create-new',
  validateRequest(CommentValidation.createComment),
  auth(USER_ROLE.user),
  CommentController.createComment,
);

router.patch(
  '/:id',
  validateRequest(CommentValidation.updateComment),
  auth(USER_ROLE.user),
  CommentController.updateComment,
);

router.delete('/:id', auth(USER_ROLE.user), CommentController.deleteComment);

router.get('/blog/:blog_id', CommentController.getCommentByBlogId);

export const CommentRoute = router;
