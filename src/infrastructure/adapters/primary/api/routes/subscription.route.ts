import { Router } from 'express';
import { validateRequest } from '../middlewares/validation/validate-request.middleware';
import { subscriptionBodySchema } from '../validators/subscription.schema';
import { container } from '../../../../di/container';
import { SubscriptionController } from '../controllers/subscription.controller';

const subscriptionRouter = Router();
const controller = container.resolve(SubscriptionController);

subscriptionRouter.post(
  '/subscribe',
  validateRequest(subscriptionBodySchema),
  controller.subscribe,
);
subscriptionRouter.get('/confirm/:token', controller.confirmSubscription);
subscriptionRouter.get('/unsubscribe/:token', controller.unsubscribe);

export default subscriptionRouter;
