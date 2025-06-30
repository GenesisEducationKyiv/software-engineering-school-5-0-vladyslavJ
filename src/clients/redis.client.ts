import { createClient, RedisClientType } from 'redis';
import { injectable } from 'tsyringe';
import ENV from '../config/env';
import { ICacheClient } from '../interfaces/cache-client.interface';

@injectable()
export class RedisClient implements ICacheClient {
  private readonly client: RedisClientType;

  constructor() {
    this.client = createClient({
      url: `redis://${ENV.REDIS_HOST}:${ENV.REDIS_PORT}`,
    });
    this.client.on('error', err => console.error('[REDIS] error', err));
  }

  async connect() {
    await this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    await this.client.quit();
  }
}
