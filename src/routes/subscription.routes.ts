import { Router } from 'express';
import { validateRequest } from '../middlewares/validateRequest';
import { subscriptionBodySchema } from '../validators/subscription.schema';
import { container } from '../container';
import { SubscriptionController } from '../controllers/subscription.controller';

const router = Router();
const controller = container.resolve(SubscriptionController);

router.post('/subscribe', validateRequest(subscriptionBodySchema), controller.subscribe);
router.get('/confirm/:token', controller.confirmSubscription);
router.get('/unsubscribe/:token', controller.unsubscribe);

export default router;
