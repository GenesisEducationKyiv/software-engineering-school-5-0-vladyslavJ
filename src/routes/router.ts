import { Router } from 'express';
import weatherRouter from './weather.route';
import subscriptionRouter from './subscription.route';

const router = Router();

router.use('/', weatherRouter);
router.use('/', subscriptionRouter);

export default router;
