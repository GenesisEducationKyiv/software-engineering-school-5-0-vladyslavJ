import { Router } from 'express';
import { validateRequest } from '../middlewares/validation/validate-request.middleware';
import { weatherQuerySchema } from '../validators/weather.schema';
import { container } from '../../../../di/container';
import { WeatherController } from '../controllers/weather.controller';

const weatherRouter = Router();
const controller = container.resolve(WeatherController);

weatherRouter.get(
  '/weather',
  validateRequest(weatherQuerySchema, 'query'),
  controller.getWeather.bind(controller),
);

export default weatherRouter;
