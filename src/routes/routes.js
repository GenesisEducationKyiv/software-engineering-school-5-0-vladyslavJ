import { Router } from 'express';
import weatherRouter from './weather.routes.js';

const router = Router();

router.use('/', weatherRouter);

export default router;
