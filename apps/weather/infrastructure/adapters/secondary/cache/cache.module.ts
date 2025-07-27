import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from './clients/redis.client';
import { WeatherCacheAdapter } from './weather-cache.adapter';
// import { ICacheMetricService } from './interfaces/cache-metric-service.interface';
import { CacheDiTokens } from './di/di-tokens';
import { LoggerModule } from '../../../../../../libs/modules/logger/logger.module';
import { CACHE_TTL } from './constants/cache-ttl.const';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [
    {
      provide: CacheDiTokens.REDIS_CACHE_CLIENT,
      useClass: RedisClient,
    },
    {
      provide: CacheDiTokens.WEATHER_CACHE_SERVICE,
      useClass: WeatherCacheAdapter,
    },
    {
      provide: CacheDiTokens.WEATHER_TTL,
      useValue: CACHE_TTL,
    },
    // CacheMetricService,
  ],
  exports: [CacheDiTokens.WEATHER_CACHE_SERVICE, CacheDiTokens.WEATHER_TTL],
})
export class CacheModule {}
