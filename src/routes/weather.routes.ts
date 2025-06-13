import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller';
import { weatherQuerySchema } from '../validators/weather.schema';
import { validateRequest } from '../middlewares/validateRequest';

const weatherRouter = Router();

weatherRouter.get('/weather', validateRequest(weatherQuerySchema, 'query'), getWeather);

export default weatherRouter;
