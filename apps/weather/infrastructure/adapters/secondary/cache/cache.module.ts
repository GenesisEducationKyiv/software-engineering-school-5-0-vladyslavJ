import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisClient } from './clients/redis.client';
import { WeatherCacheAdapter } from './weather-cache.adapter';
import { CacheDiTokens } from './di/di-tokens';
import { LoggerModule } from '../../../../../../libs/modules/logger/logger.module';
import { CACHE_TTL } from './constants/cache-ttl.const';
import { MetricsModule } from '../../../../../../libs/modules/metrics/metrics.module';

@Module({
  imports: [ConfigModule, LoggerModule, MetricsModule],
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
  ],
  exports: [CacheDiTokens.WEATHER_CACHE_SERVICE, CacheDiTokens.WEATHER_TTL],
})
export class CacheModule {}
