import { injectable, inject } from 'tsyringe';
import { ICacheClient } from '../interfaces/cache-client.interface';
import { TOKENS } from '../config/di-tokens.config';
import { ICacheService } from '../interfaces/cache-service.interface';
import { ICacheMetricService } from '../interfaces/cache-metric-service.interface';

@injectable()
export class RedisCacheService<T> implements ICacheService<T> {
  constructor(
    @inject(TOKENS.IRedisClient) private readonly client: ICacheClient,
    @inject(TOKENS.ICacheMetricService) private readonly metricService: ICacheMetricService,
  ) {}

  async get(key: string) {
    try {
      const payload = await this.client.get(key);
      if (payload) {
        this.metricService.incCacheHit();
        return JSON.parse(payload) as T;
      } else {
        this.metricService.incCacheMiss();
        return null;
      }
    } catch (err) {
      this.metricService.incCacheError();
      throw err;
    }
  }

  async set(key: string, value: T, ttlSeconds: number) {
    try {
      await this.client.set(key, JSON.stringify(value), ttlSeconds);
    } catch (err) {
      this.metricService.incCacheError();
      throw err;
    }
  }
}
