import 'reflect-metadata';
import app from './app';
import ENV from './config/env';
import { AppDataSource } from './config/dataSource';
import './jobs/scheduler';
import { connectRedis } from './utils/redisClient';
import { logger } from './utils/logger';

async function bootstrap() {
	try {
		await connectRedis();
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
		app.listen(ENV.PORT, () =>
			logger.info(`API is running at http://localhost:${ENV.PORT}`)
		);
	} catch (err) {
		logger.error('Init error: ' + (err instanceof Error ? err.stack : err));
		process.exit(1);
	}
}

bootstrap();
