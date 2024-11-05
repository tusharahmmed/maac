import { USER_ROLE } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';

const router = Router();

router.post(
  '/create-new',
  validateRequest(BlogValidation.createBlog),
  auth(USER_ROLE.user),
  BlogController.createBlog,
);

router.patch(
  '/:id',
  validateRequest(BlogValidation.updateBlog),
  auth(USER_ROLE.user),
  BlogController.updateSingleProduct,
);

router.delete('/:id', auth(USER_ROLE.user), BlogController.deleteSingleBlog);

router.get('/:id', BlogController.getSingleBlog);

router.get('/', BlogController.getAllBlogs);

export const BlogRoutes = router;
