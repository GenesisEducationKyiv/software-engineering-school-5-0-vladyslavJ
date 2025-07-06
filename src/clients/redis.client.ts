import { createClient, RedisClientType } from 'redis';
import { injectable, inject } from 'tsyringe';
import { TOKENS } from '../config/di-tokens.config';
import { ICacheClient } from '../interfaces/cache-client.interface';
import { ILogger } from '../interfaces/logger-service.interface';

@injectable()
export class RedisClient implements ICacheClient {
  private readonly client: RedisClientType;
  private isConnected = false;

  constructor(
    @inject(TOKENS.RedisHost) private readonly host: string,
    @inject(TOKENS.RedisPort) private readonly port: number,
    @inject(TOKENS.ILogger) private readonly logger: ILogger,
  ) {
    this.client = createClient({
      url: `redis://${this.host}:${this.port}`,
      socket: {
        reconnectStrategy: retries => {
          this.logger.warn(`[REDIS] Reconnecting... (attempt: ${retries + 1})`);
          return Math.min(retries * 50, 5000);
        },
      },
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      this.logger.info('[REDIS] Connected successfully');
    });

    this.client.on('error', err => {
      this.isConnected = false;
      this.logger.error('[REDIS] error', err);
    });

    this.client.on('end', () => {
      this.isConnected = false;
      this.logger.warn('[REDIS] Connection closed');
    });
  }

  async connect() {
    if (this.isConnected) return;
    await this.client.connect();
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) {
      this.logger.warn(`[REDIS] GET call aborted, no connection. Key: ${key}`);
      return null;
    }
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn(`[REDIS] SET call aborted, no connection. Key: ${key}`);
      return;
    }

    if (ttl) {
      await this.client.set(key, value, { EX: ttl });
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn(`[REDIS] DEL call aborted, no connection. Key: ${key}`);
      return;
    }
    await this.client.del(key);
  }

  async quit(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}
