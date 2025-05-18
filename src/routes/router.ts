// src/routes/router.ts

import { Router } from 'express';
import weatherRouter from './weather.routes';
import subscriptionRouter from './subscription.routes';

const router = Router();

router.use('/', weatherRouter);
router.use('/', subscriptionRouter);

export default router;
