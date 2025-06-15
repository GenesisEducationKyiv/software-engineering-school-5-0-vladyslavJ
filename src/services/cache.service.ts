import { injectable } from 'tsyringe';
import { redisClient } from '../clients/redis.client';

export interface ICacheService<T> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, ttlSeconds: number): Promise<void>;
}

@injectable()
export class RedisCacheService<T> implements ICacheService<T> {
  async get(key: string) {
    const payload = await redisClient.get(key);
    return payload ? (JSON.parse(payload) as T) : null;
  }

  async set(key: string, value: T, ttlSeconds: number) {
    await redisClient.set(key, JSON.stringify(value), { EX: ttlSeconds });
  }
}
