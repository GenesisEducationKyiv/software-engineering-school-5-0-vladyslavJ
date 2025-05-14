import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller.js';
import { weatherQuerySchema } from '../validators/weather.schema.js';
import { validateRequest } from '../middlewares/validateRequest.js';

const weatherRouter = Router();

weatherRouter.get(
	'/weather',
	validateRequest(weatherQuerySchema, 'query'),
	getWeather
);

export default weatherRouter;
