import { createClient, RedisClientType } from 'redis';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/di-tokens.config';
import { ICacheClient } from '../interfaces/cache-client.interface';

@injectable()
export class RedisClient implements ICacheClient {
  private readonly client: RedisClientType;

  constructor(
    @inject(TOKENS.RedisHost) private readonly host: string,
    @inject(TOKENS.RedisPort) private readonly port: number,
  ) {
    this.client = createClient({
      url: `redis://${this.host}:${this.port}`,
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
