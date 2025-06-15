import 'reflect-metadata';
import { container } from 'tsyringe';
import { TOKENS } from './config/di.tokens';
import { WeatherApiClient, IWeatherApiClient } from './clients/weatherApi.client';
import { RedisCacheService, ICacheService } from './services/cache.service';
import { redisClient } from './clients/redis.client';
import { NodemailerTransport, IMailTransport } from './clients/mailer.client';
import { GmailService, IMailService } from './services/mail.service';
import { SubscriptionService } from './services/subscription.service';
import { SubscriptionController } from './controllers/subscription.controller';
import {
  SubscriptionRepository,
  ISubscriptionRepository,
} from './repositories/subscription.repository';
import { WeatherService } from './services/weather.service';
import { WeatherMapper } from './mappers/weather.mapper';
import { WeatherDto } from './dto/weather.dto';
import { WeatherController } from './controllers/weather.controller';
import { WeatherDigestJob } from './jobs/weatherDigest.job';
import ENV from './config/env';

container.registerSingleton<ICacheService<WeatherDto>>(
  TOKENS.CacheServiceWeather,
  RedisCacheService,
);
container.registerInstance<number>(TOKENS.RedisTTL, ENV.REDIS_TTL);
container.registerInstance(TOKENS.IRedisClient, redisClient);

container.registerSingleton<IWeatherApiClient>(TOKENS.IWeatherApiClient, WeatherApiClient);
container.registerSingleton(TOKENS.WeatherMapper, WeatherMapper);
container.registerSingleton(TOKENS.WeatherService, WeatherService);
container.registerSingleton(TOKENS.WeatherController, WeatherController);
container.registerSingleton(TOKENS.WeatherDigestJob, WeatherDigestJob);

container.registerSingleton<IMailTransport>(TOKENS.IMailTransport, NodemailerTransport);
container.registerSingleton<IMailService>(TOKENS.IMailService, GmailService);

container.registerSingleton<ISubscriptionRepository>(
  TOKENS.ISubscriptionRepository,
  SubscriptionRepository,
);
container.registerSingleton(TOKENS.SubscriptionService, SubscriptionService);
container.registerSingleton(TOKENS.SubscriptionController, SubscriptionController);

export { container };
