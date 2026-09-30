import { Router } from 'express';

export function createApplicationRoutes(controller) {
  const router = Router();

  router.post('/applications', controller.create);
  router.get('/applications', controller.list);
  router.put('/applications/:id/status', controller.changeStatus);

  return router;
}
