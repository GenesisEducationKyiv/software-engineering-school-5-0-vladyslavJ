import { Injectable, Inject, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import { ICacheServiceClient } from '../interfaces/cache-client.interface';
import { LoggerInterface } from '../../../../../../../libs/modules/logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../../../../../../../libs/modules/logger/di/di-tokens';

@Injectable()
export class RedisClient implements ICacheServiceClient, OnModuleInit {
  private readonly client: RedisClientType;
  private defaultTtl: number;
  private isConnected = false;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    const host = this.configService.get<string>('redis.host');
    const port = this.configService.get<number>('redis.port');
    this.defaultTtl = this.configService.get<number>('redis.defaultTtl', 604800);

    this.client = createClient({
      url: `redis://${host}:${port}`,
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
      this.logger.error('[REDIS] Error', err);
    });

    this.client.on('end', () => {
      this.isConnected = false;
      this.logger.warn('[REDIS] Connection closed');
    });

    this.logger.setContext(RedisClient.name);
  }

  async onModuleInit() {
    await this.connect();
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
    const finalTtl = ttl ?? this.defaultTtl;
    await this.client.set(key, value, { EX: finalTtl });
  }

  async del(key: string): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn(`[REDIS] DEL call aborted, no connection. Key: ${key}`);
      return;
    }
    await this.client.del(key);
  }

  async connect() {
    if (this.isConnected) return;
    await this.client.connect();
  }

  async quit(): Promise<void> {
    if (this.isConnected) {
      await this.client.quit();
    }
  }
}
