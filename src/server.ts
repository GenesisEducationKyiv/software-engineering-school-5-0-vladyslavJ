import 'reflect-metadata';
import './container';
import { container } from 'tsyringe';
import app from './app';
import ENV from './config/env';
import { AppDataSource } from './config/dataSource';
import './jobs/scheduler.job';
import { connectRedis } from './clients/redis.client';
import { ILogger } from './interfaces/logger-service.interface';
import { TOKENS } from './config/di-tokens.config';

const logger = container.resolve<ILogger>(TOKENS.ILogger);

async function bootstrap() {
  try {
    await connectRedis();
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    app.listen(ENV.PORT, () => logger.info(`API is running at http://localhost:${ENV.PORT}`));
  } catch (err) {
    logger.error('Init error: ' + (err instanceof Error ? err.stack : String(err)));
    process.exit(1);
  }
}

bootstrap();
