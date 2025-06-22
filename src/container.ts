import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './config/di.tokens';
import { IWeatherApiClient } from './interfaces/weather-api.client.interface';
import { WeatherApiClient } from './clients/weatherApi.client';
import { RedisCacheService } from './services/cache.service';
import { ICacheService } from './interfaces/cache.service.interface';
import { redisClient } from './clients/redis.client';
import { NodemailerTransport } from './clients/mailer.client';
import { IEmailTransport } from './interfaces/email.client.interface';
import { GmailService } from './services/mail.service';
import { IEmailService } from './interfaces/email.service.interface';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { ISubscriptionRepository } from './interfaces/subscription.repository.interface';
import { WeatherService } from './services/weather.service';
import { WeatherMapper } from './mappers/weather.mapper';
import { WeatherDto } from './dto/weather.dto';
import { WeatherController } from './controllers/weather.controller';
import { WeatherDigestJob } from './jobs/weatherDigest.job';
import { IWeatherMapper } from './interfaces/weather.mapper.interface';
import { ILogger } from './interfaces/logger.service.interface';
import { LoggerService } from './services/logger.service';
import { ErrorHandlerMiddleware } from './middlewares/errorHandler';
import ENV from './config/env';

container.registerSingleton<ICacheService<WeatherDto>>(
  TOKENS.CacheServiceWeather,
  RedisCacheService,
);
container.registerInstance<number>(TOKENS.RedisTTL, ENV.REDIS_TTL);
container.registerInstance(TOKENS.IRedisClient, redisClient);

container.registerSingleton<IWeatherApiClient>(TOKENS.IWeatherApiClient, WeatherApiClient);
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

container.registerSingleton<ILogger>(TOKENS.ILogger, LoggerService);

container.registerSingleton<ErrorHandlerMiddleware>(
  TOKENS.ErrorHandlerMiddleware,
  ErrorHandlerMiddleware,
);

export { container };
