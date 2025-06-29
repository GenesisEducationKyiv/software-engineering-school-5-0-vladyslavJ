import { injectable, inject } from 'tsyringe';
import { ICacheClient } from '../interfaces/cache-client.interface';
import { TOKENS } from '../config/di-tokens.config';
import { ICacheService } from '../interfaces/cache-service.interface';

@injectable()
export class RedisCacheService<T> implements ICacheService<T> {
  constructor(@inject(TOKENS.IRedisClient) private readonly client: ICacheClient) {}

  async get(key: string) {
    const payload = await this.client.get(key);
    return payload ? (JSON.parse(payload) as T) : null;
  }

  async set(key: string, value: T, ttlSeconds: number) {
    await this.client.set(key, JSON.stringify(value), ttlSeconds);
  }
}
