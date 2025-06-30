import { injectable, inject } from 'tsyringe';
import { ICacheClient } from '../interfaces/cache-client.interface';
import { TOKENS } from '../config/di-tokens.config';
import { ICacheService } from '../interfaces/cache-service.interface';
import { cacheHitCounter, cacheMissCounter, cacheErrorCounter } from '../services/metrics.service';

@injectable()
export class RedisCacheService<T> implements ICacheService<T> {
  constructor(@inject(TOKENS.IRedisClient) private readonly client: ICacheClient) {}

  async get(key: string) {
    try {
      const payload = await this.client.get(key);
      if (payload) {
        cacheHitCounter.inc();
        return JSON.parse(payload) as T;
      } else {
        cacheMissCounter.inc();
        return null;
      }
    } catch (err) {
      cacheErrorCounter.inc();
      throw err;
    }
  }

  async set(key: string, value: T, ttlSeconds: number) {
    try {
      await this.client.set(key, JSON.stringify(value), ttlSeconds);
    } catch (err) {
      cacheErrorCounter.inc();
      throw err;
    }
  }
}
