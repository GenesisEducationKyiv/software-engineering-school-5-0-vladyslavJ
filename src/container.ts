import 'reflect-metadata';
import { container } from 'tsyringe';
import { HttpClient, IHttpClient } from './clients/http.client';
import { WeatherApiClient, IWeatherApiClient } from './clients/weatherApi.client';
import { RedisCacheService, ICacheService } from './services/cache.service';
import { WeatherService } from './services/weather.service';
import { WeatherMapper } from './mappers/weather.mapper';
import { WeatherDto } from './dto/weather.dto';
import { WeatherController } from './controllers/weather.controller';
import { WeatherDigestJob } from './jobs/weatherDigest.job';
import ENV from './config/env';

container.registerSingleton<IHttpClient>('IHttpClient', HttpClient);
container.registerSingleton<IWeatherApiClient>('IWeatherApiClient', WeatherApiClient);
container.registerSingleton<ICacheService<WeatherDto>>(
  'ICacheService<WeatherDto>',
  RedisCacheService,
);
container.registerInstance<number>('RedisTTL', ENV.REDIS_TTL);
container.registerSingleton(WeatherMapper);
container.registerSingleton(WeatherService);
container.registerSingleton(WeatherController);
container.registerSingleton(WeatherDigestJob);

export { container };
