import 'dotenv/config';
import { checkEnv } from '../utils/checkEnv';
import { ConfigError } from '../utils/customError';

export interface EnvConfig {
	PORT: number;
	WEATHER_API_KEY: string;
	WEATHER_BASE_URL: string;
	DB_USER: string;
	DB_HOST: string;
	DB_NAME: string;
	DB_PASSWORD: string;
	DB_PORT: number;
	DB_URL?: string;
	MAIL_HOST: string;
	MAIL_PORT: number;
	MAIL_SECURE: boolean;
	MAIL_USER: string;
	MAIL_PASS: string;
	MAIL_FROM: string;
	APP_BASE_URL: string;
	REDIS_HOST: string; //localhost або redis
	REDIS_PORT: number;
	REDIS_TTL: number;
}

const ENV: Readonly<EnvConfig> = Object.freeze({
	PORT: +(process.env.PORT ?? 3000),
	WEATHER_API_KEY: process.env.WEATHER_API_KEY ?? '',
	WEATHER_BASE_URL: process.env.WEATHER_BASE_URL ?? '',
	DB_USER: process.env.DB_USER ?? '',
	DB_HOST: process.env.DB_HOST ?? '',
	DB_NAME: process.env.DB_NAME ?? '',
	DB_PASSWORD: process.env.DB_PASSWORD ?? '',
	DB_PORT: +(process.env.DB_PORT ?? 5432),
	DB_URL: process.env.DB_URL,
	MAIL_HOST: process.env.MAIL_HOST ?? 'smtp.gmail.com',
	MAIL_PORT: +(process.env.MAIL_PORT ?? 465),
	MAIL_SECURE: (process.env.MAIL_SECURE ?? 'true') === 'true',
	MAIL_USER: process.env.MAIL_USER ?? '',
	MAIL_PASS: process.env.MAIL_PASS ?? '',
	MAIL_FROM: process.env.MAIL_FROM ?? '',
	APP_BASE_URL: process.env.APP_BASE_URL ?? 'http://localhost:3000',
	REDIS_HOST: process.env.REDIS_HOST ?? 'redis',
	REDIS_PORT: +(process.env.REDIS_PORT ?? 6379),
	REDIS_TTL: +(process.env.REDIS_TTL ?? 300), // 5 хв.
});

checkEnv(ENV, ConfigError);

export default ENV;
