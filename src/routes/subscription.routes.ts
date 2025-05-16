import { Router } from 'express';
import {
	subscribe,
	confirmSubscription,
	unsubscribe,
} from '../controllers/subscription.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { subscriptionBodySchema } from '../validators/subscription.schema';

const subscriptionRouter = Router();

subscriptionRouter.post(
	'/subscribe',
	validateRequest(subscriptionBodySchema),
	subscribe
);
subscriptionRouter.get('/confirm/:token', confirmSubscription);
subscriptionRouter.get('/unsubscribe/:token', unsubscribe);

export default subscriptionRouter;
