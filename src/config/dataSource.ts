import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ENV from './env';
import { Subscription } from '../models/subscription.entity.js';

export const AppDataSource = new DataSource({
	type: 'postgres',
	host: ENV.DB_HOST,
	port: ENV.DB_PORT,
	username: ENV.DB_USER,
	password: ENV.DB_PASSWORD,
	database: ENV.DB_NAME,
	entities: [Subscription],
	migrations: [
		process.env.NODE_ENV === 'production'
			? 'dist/migrations/*'
			: 'src/migrations/*',
	],
	synchronize: false,
	logging: false,
});
