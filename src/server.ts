import 'reflect-metadata';
import './container';
import { container } from 'tsyringe';
import app from './app';
import ENV from './config/env';
import { AppDataSource } from './config/dataSource';
import './jobs/scheduler.job';
import { ILogger } from './interfaces/logger-service.interface';
import { ICacheClient } from './interfaces/cache-client.interface';
import { TOKENS } from './config/di-tokens.config';

const logger = container.resolve<ILogger>(TOKENS.ILogger);
const redisClient = container.resolve<ICacheClient>(TOKENS.IRedisClient);

async function bootstrap() {
  try {
    await redisClient.connect();
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    app.listen(ENV.PORT, () => logger.info(`API is running at http://localhost:${ENV.PORT}`));
  } catch (err) {
    logger.error('Init error: ' + (err instanceof Error ? err.stack : String(err)));
    process.exit(1);
  }
}

bootstrap();
