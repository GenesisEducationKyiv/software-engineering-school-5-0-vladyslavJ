import { Injectable, Inject } from '@nestjs/common';
import { IWeatherCachePort } from '../../../../domain/ports/cache/weather-cache.port';
import { Weather } from '../../../../../../libs/common/models/weather.model';
import { ICacheServiceClient } from './interfaces/cache-client.interface';
import { CacheDiTokens } from './di/di-tokens';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { LoggerInterface } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { RpcException } from '@nestjs/microservices';
import { MetricsDiTokens } from '../../../../../../libs/modules/metrics/di/di-tokens';
import { CacheMetricServiceInterface } from '../../../../../../libs/modules/metrics/interfaces/cache-metric-service.interface';

@Injectable()
export class WeatherCacheAdapter implements IWeatherCachePort {
  constructor(
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
    @Inject(CacheDiTokens.REDIS_CACHE_CLIENT)
    private readonly client: ICacheServiceClient,
    @Inject(MetricsDiTokens.CACHE_METRIC_SERVICE)
    private readonly metricService: CacheMetricServiceInterface,
  ) {
    this.logger.setContext(WeatherCacheAdapter.name);
  }

  async get(key: string): Promise<Weather | null> {
    try {
      const payload = await this.client.get(key);
      if (payload) {
        this.metricService.incCacheHit();
        this.logger.info(`HIT for key: ${key}`);
        const data = JSON.parse(payload);
        return new Weather(data.temperature, data.humidity, data.description);
      } else {
        this.metricService.incCacheMiss();
        this.logger.warn(`MISS for key: ${key}`);
        return null;
      }
    } catch (err) {
      this.metricService.incCacheError();
      this.logger.error(`Error on GET. Key: ${key}`, String(err));
      throw new RpcException({
        message: 'Cache GET error',
        key,
        error: String(err),
      });
    }
  }

  async set(key: string, value: Weather, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), ttlSeconds);
      this.metricService.incCacheSet();
      this.logger.info(`SET for key: ${key}`);
    } catch (err) {
      this.metricService.incCacheError();
      this.logger.error(`Error on SET. Key: ${key}`, String(err));
      throw new RpcException({
        message: 'Cache SET error',
        key,
        error: String(err),
      });
    }
  }
}
