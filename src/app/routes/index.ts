import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { TagRoutes } from '../modules/tag/tag.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/tags',
    route: TagRoutes,
  },
];

moduleRoutes.forEach(module => router.use(module.path, module.route));
export const applicationRoutes = router;
