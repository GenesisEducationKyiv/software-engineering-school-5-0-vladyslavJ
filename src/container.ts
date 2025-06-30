import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './config/di-tokens.config';
import { RedisCacheService } from './services/cache.service';
import { ICacheService } from './interfaces/cache-service.interface';
import { RedisClient } from './clients/redis.client';
import { ICacheClient } from './interfaces/cache-client.interface';
import { NodemailerTransport } from './clients/mailer.client';
import { IEmailTransport } from './interfaces/email-client.interface';
import { GmailService } from './services/mail.service';
import { IEmailService } from './interfaces/email-service.interface';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { ISubscriptionRepository } from './interfaces/subscription-repository.interface';
import { WeatherService } from './services/weather.service';
import { WeatherMapper } from './mappers/weather-data.mapper';
import { WeatherDto } from './dto/weather.dto';
import { WeatherController } from './controllers/weather.controller';
import { WeatherDigestJob } from './jobs/weather-digest.job';
import { IWeatherMapper } from './interfaces/weather-data-mapper.interface';
import { ILogger } from './interfaces/logger-service.interface';
import { LoggerService } from './services/logger.service';
import { ErrorHandlerMiddleware } from './middlewares/error-handler.middleware';
import { WeatherApiClient } from './clients/weather-api.client';
import { OpenWeatherMapClient } from './clients/open-weather-map.client';
import ENV from './config/env';
import { CacheMetricService } from './services/cache-metric.service';
import { ICacheMetricService } from './interfaces/cache-metric-service.interface';

container.registerSingleton<ILogger>(TOKENS.ILogger, LoggerService);

container.registerInstance<number>(TOKENS.RedisTTL, ENV.REDIS_TTL);
container.registerSingleton<ICacheClient>(TOKENS.IRedisClient, RedisClient);
container.registerSingleton<ICacheService<WeatherDto>>(
  TOKENS.CacheServiceWeather,
  RedisCacheService,
);

const weatherApiClient = container.resolve(WeatherApiClient);
const openWeatherMapClient = container.resolve(OpenWeatherMapClient);
weatherApiClient.setNextProvider(openWeatherMapClient);
container.registerInstance(TOKENS.IWeatherApiProvider, weatherApiClient);

container.registerSingleton<IWeatherMapper>(TOKENS.IWeatherMapper, WeatherMapper);
container.registerSingleton(TOKENS.WeatherService, WeatherService);
container.registerSingleton(TOKENS.WeatherController, WeatherController);
container.registerSingleton(TOKENS.WeatherDigestJob, WeatherDigestJob);

container.registerSingleton<IEmailTransport>(TOKENS.IEmailTransport, NodemailerTransport);
container.registerSingleton<IEmailService>(TOKENS.IEmailService, GmailService);

container.registerSingleton<ISubscriptionRepository>(
  TOKENS.ISubscriptionRepository,
  SubscriptionRepository,
);
container.registerSingleton(TOKENS.SubscriptionService, SubscriptionService);
container.registerSingleton(TOKENS.SubscriptionController, SubscriptionController);

container.registerSingleton<ErrorHandlerMiddleware>(
  TOKENS.ErrorHandlerMiddleware,
  ErrorHandlerMiddleware,
);

container.registerSingleton<ICacheMetricService>(TOKENS.ICacheMetricService, CacheMetricService);

export { container };
