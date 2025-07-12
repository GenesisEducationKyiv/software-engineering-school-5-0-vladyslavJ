import 'reflect-metadata';
import { container } from 'tsyringe';
import ENV from '../config/env';
import { TOKENS } from './di-tokens';
import { ILogger } from '../../shared/interfaces/logger-service.interface';
import { IWeatherProviderPort } from '../../domain/ports/providers/weather-provider.port';
import { IWeatherCachePort } from '../../domain/ports/cache/weather-cache.port';
import { IEmailPort } from '../../domain/ports/notification/email.port';
import { ISubscriptionRepository } from '../../domain/ports/repositories/subscription-repository.port';
import { IWeatherInputPort } from '../../application/ports/weather.port';
import { GetWeatherUseCase } from '../../application/use-cases/weather/get-weather.use-case';
import { SubscribeUseCase } from '../../application/use-cases/subscription/subscribe.use-case';
import { ConfirmSubscriptionUseCase } from '../../application/use-cases/subscription/confirm-subscription.use-case';
import { UnsubscribeUseCase } from '../../application/use-cases/subscription/unsubscribe.use-case';
import { SendWeatherDigestUseCase } from '../../application/use-cases/subscription/send-weather-digest.use-case';
import { LoggerService } from '../services/logger.service';
import { CacheMetricService } from '../services/cache-metric.service';
import { ICacheMetricService } from '../interfaces/cache-metric-service.interface';
import { ErrorHandlerMiddleware } from '../adapters/primary/api/middlewares/error-handling/error-handler.middleware';
import { WeatherDigestJob } from '../adapters/primary/jobs/weather-digest.job';
import { SubscriptionRepository } from '../adapters/secondary/repositories/subscription.repository';
import { WeatherCacheAdapter } from '../adapters/secondary/cache/weather-cache.adapter';
import { EmailAdapter } from '../adapters/secondary/email/email.adapter';
import { WeatherApiAdapter } from '../adapters/secondary/weather-providers/weather-api.adapter';
import { OpenWeatherMapAdapter } from '../adapters/secondary/weather-providers/open-weather-map.adapter';
import { RedisClient } from '../adapters/secondary/cache/clients/redis.client';
import { ICacheClient } from '../interfaces/cache-client.interface';
import { NodemailerTransport } from '../adapters/secondary/email/clients/nodemailer.client';
import { IEmailTransport } from '../interfaces/email-transport.interface';
import { IWeatherMapper } from '../adapters/secondary/weather-providers/interfaces/weather-data-mapper.interface';
import { IWeatherApiResponse } from '../adapters/secondary/weather-providers/interfaces/weather-api-response.interface';
import { IOpenWeatherMapResponse } from '../adapters/secondary/weather-providers/interfaces/open-weather-map-response.interface';
import { WeatherApiMapper } from '../adapters/secondary/weather-providers/mappers/weather-api.mapper';
import { OpenWeatherMapMapper } from '../adapters/secondary/weather-providers/mappers/open-weather-map.mapper';
import { WeatherController } from '../adapters/primary/api/controllers/weather.controller';
import { SubscriptionController } from '../adapters/primary/api/controllers/subscription.controller';
import { ISubscriptionInputPort } from '../../application/ports/subscription.port';
import { SubscriptionService } from '../../application/services/subscription.service';
import { WeatherService } from '../../application/services/weather.service';

container.registerSingleton<ILogger>(TOKENS.ILogger, LoggerService);
container.registerSingleton<ErrorHandlerMiddleware>(
  TOKENS.ErrorHandlerMiddleware,
  ErrorHandlerMiddleware,
);
container.registerSingleton<ICacheMetricService>(TOKENS.ICacheMetricService, CacheMetricService);
container.registerInstance<string>(TOKENS.RedisHost, ENV.REDIS_HOST);
container.registerInstance<number>(TOKENS.RedisPort, ENV.REDIS_PORT);
container.registerInstance<number>(TOKENS.RedisDefaultTTL, ENV.REDIS_DEFAULT_TTL);
container.registerInstance<number>(TOKENS.RedisTTL, ENV.REDIS_TTL);
container.registerSingleton<ICacheClient>(TOKENS.IRedisClient, RedisClient);
container.registerSingleton<IWeatherCachePort>(TOKENS.IWeatherCachePort, WeatherCacheAdapter);

container.registerSingleton<IWeatherMapper<IWeatherApiResponse>>(
  TOKENS.WeatherApiMapper,
  WeatherApiMapper,
);
container.registerSingleton<IWeatherMapper<IOpenWeatherMapResponse>>(
  TOKENS.OpenWeatherMapMapper,
  OpenWeatherMapMapper,
);

const weatherApiAdapter = container.resolve(WeatherApiAdapter);
const openWeatherMapAdapter = container.resolve(OpenWeatherMapAdapter);
weatherApiAdapter.setNextProvider(openWeatherMapAdapter);
container.registerInstance<IWeatherProviderPort>(TOKENS.IWeatherProviderPort, weatherApiAdapter);

container.registerSingleton<IEmailTransport>(TOKENS.IEmailTransport, NodemailerTransport);
container.registerSingleton<IEmailPort>(TOKENS.IEmailPort, EmailAdapter);

container.registerSingleton(GetWeatherUseCase);
container.registerSingleton<IWeatherInputPort>(TOKENS.IWeatherInputPort, WeatherService);
container.registerSingleton(WeatherController);

container.register<ISubscriptionRepository>(TOKENS.ISubscriptionRepository, {
  useClass: SubscriptionRepository,
});
container.registerSingleton(SubscribeUseCase);
container.registerSingleton(ConfirmSubscriptionUseCase);
container.registerSingleton(UnsubscribeUseCase);
container.registerSingleton(SendWeatherDigestUseCase);
container.registerSingleton<ISubscriptionInputPort>(
  TOKENS.ISubscriptionInputPort,
  SubscriptionService,
);
container.registerSingleton(SubscriptionController);

container.registerSingleton(WeatherDigestJob);

//container.registerSingleton(TOKENS.WeatherService, WeatherService);

export { container };
