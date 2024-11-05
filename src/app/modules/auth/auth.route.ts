import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { AuthValidation } from './auth.validation';

const router = Router();

router.post(
  '/sign-up',
  validateRequest(AuthValidation.signup),
  AuthController.signup,
);

router.post(
  '/sign-in',
  validateRequest(AuthValidation.signin),
  AuthController.signin,
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshToken),
  AuthController.refreshToken,
);

export const AuthRoutes = router;
