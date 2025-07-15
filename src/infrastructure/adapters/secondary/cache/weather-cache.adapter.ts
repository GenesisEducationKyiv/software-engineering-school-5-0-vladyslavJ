import { injectable, inject } from 'tsyringe';
import { ICacheClient } from '../../../interfaces/cache-client.interface';
import { TOKENS } from '../../../di/di-tokens';
import { IWeatherCachePort } from '../../../../domain/ports/cache/weather-cache.port';
import { ICacheMetricService } from '../../../interfaces/cache-metric-service.interface';
import { Weather } from '../../../../domain/models/weather.model';

@injectable()
export class WeatherCacheAdapter implements IWeatherCachePort {
  constructor(
    @inject(TOKENS.IRedisClient) private readonly client: ICacheClient,
    @inject(TOKENS.ICacheMetricService) private readonly metricService: ICacheMetricService,
  ) {}

  async get(key: string): Promise<Weather | null> {
    try {
      const payload = await this.client.get(key);
      if (payload) {
        this.metricService.incCacheHit();
        const data = JSON.parse(payload);
        return new Weather(data.temperature, data.humidity, data.description);
      } else {
        this.metricService.incCacheMiss();
        return null;
      }
    } catch (err) {
      this.metricService.incCacheError();
      throw err;
    }
  }

  async set(key: string, value: Weather, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value), ttlSeconds);
      this.metricService.incCacheSet();
    } catch (err) {
      this.metricService.incCacheError();
      throw err;
    }
  }
}
