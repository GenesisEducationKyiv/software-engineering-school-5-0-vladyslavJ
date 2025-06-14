import { Router } from 'express';
import { createWeatherController } from '../controllers/weather.controller';
import { weatherQuerySchema } from '../validators/weather.schema';
import { validateRequest } from '../middlewares/validateRequest';
import { WeatherService } from '../services/weather.service';
import { WeatherApiClient } from '../clients/weatherApi.client';
import { RedisCacheService } from '../services/cache.service';
import { WeatherMapper } from '../mappers/weather.mapper';
import { WeatherDto } from '../dto/weather.dto';
import ENV from '../config/env';

const weatherRouter = Router();

const apiClient = new WeatherApiClient();
const cache = new RedisCacheService<WeatherDto>();
const mapper = new WeatherMapper();
const ttl = ENV.REDIS_TTL;

const weatherService = new WeatherService(apiClient, cache, mapper, ttl);
const getWeather = createWeatherController(weatherService);

weatherRouter.get('/weather', validateRequest(weatherQuerySchema, 'query'), getWeather);

export default weatherRouter;
