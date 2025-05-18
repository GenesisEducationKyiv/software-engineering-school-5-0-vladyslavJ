// src/server.ts

import 'reflect-metadata';
import app from './app';
import ENV from './config/env';
import { AppDataSource } from './config/dataSource';
import './jobs/scheduler';
import { connectRedis } from './utils/redisClient';

async function bootstrap() {
	try {
		await connectRedis();
		await AppDataSource.initialize();
		await AppDataSource.runMigrations();
		app.listen(ENV.PORT, () =>
			console.log(`API is running at http://localhost:${ENV.PORT}`)
		);
	} catch (err) {
		console.error('Init error', err);
		process.exit(1);
	}
}

bootstrap();
