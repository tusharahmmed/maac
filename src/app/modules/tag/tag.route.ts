import { USER_ROLE } from '@prisma/client';
import { Router } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { TagController } from './tag.controller';
import { TagValidation } from './tag.validation';

const router = Router();

router.post(
  '/create-new',
  validateRequest(TagValidation.createTag),
  auth(USER_ROLE.user),
  TagController.createTag,
);

router.patch(
  '/:id',
  validateRequest(TagValidation.updateTag),
  auth(USER_ROLE.user),
  TagController.updateTag,
);

router.delete('/:id', auth(USER_ROLE.user), TagController.deleteSingleTag);

router.get('/:id', auth(USER_ROLE.user), TagController.getSingleTag);

router.get('/', TagController.getAllTags);

export const TagRoutes = router;
