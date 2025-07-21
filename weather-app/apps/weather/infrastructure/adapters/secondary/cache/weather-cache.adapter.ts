import { Injectable, Inject } from '@nestjs/common';
import { IWeatherCachePort } from '../../../../domain/ports/cache/weather-cache.port';
//import { ICacheMetricService } from './interfaces/cache-metric-service.interface';
import { Weather } from '../../../../domain/models/weather.model';
import { ICacheServiceClient } from './interfaces/cache-client.interface';
import { CacheDiTokens } from '../cache/di/di-tokens';
import { LoggerDiTokens } from '../../../../../../libs/modules/logger/di/di-tokens';
import { ILogger } from '../../../../../../libs/modules/logger/interfaces/logger.interface';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class WeatherCacheAdapter implements IWeatherCachePort {
  constructor(
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: ILogger,
    @Inject(CacheDiTokens.REDIS_CACHE_CLIENT)
    private readonly client: ICacheServiceClient,
  ) {}

  async get(key: string): Promise<Weather | null> {
    try {
      const payload = await this.client.get(key);
      if (payload) {
        //this.metricService.incCacheHit();
        this.logger.info(`[WEATHER-CACHE] HIT for key: ${key}`);
        const data = JSON.parse(payload);
        return new Weather(data.temperature, data.humidity, data.description);
      } else {
        //this.metricService.incCacheMiss();
        this.logger.warn(`[WEATHER-CACHE] MISS for key: ${key}`);
        return null;
      }
    } catch (err) {
      //this.metricService.incCacheError();
      this.logger.error(`[WEATHER-CACHE] Error on GET. Key: ${key}`, String(err));
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
      //this.metricService.incCacheSet();
      this.logger.info(`[WEATHER-CACHE] SET for key: ${key}`);
    } catch (err) {
      //this.metricService.incCacheError();
      this.logger.error(`[WEATHER-CACHE] Error on SET. Key: ${key}`, String(err));
      throw new RpcException({
        message: 'Cache SET error',
        key,
        error: String(err),
      });
    }
  }
}
