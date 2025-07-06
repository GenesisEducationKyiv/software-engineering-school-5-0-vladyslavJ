import 'dotenv/config';
import { checkEnv } from '../utils/check-env.util';
import { ConfigError } from '../utils/custom-error.util';
import { IEnvConfig } from '../interfaces/env-config.interface';

const ENV: Readonly<IEnvConfig> = Object.freeze({
  PORT: +(process.env.PORT ?? 3000),
  WEATHER_API_KEY: process.env.WEATHER_API_KEY ?? '',
  WEATHER_BASE_URL: process.env.WEATHER_BASE_URL ?? '',
  DB_USER: process.env.DB_USER ?? '',
  DB_HOST: process.env.DB_HOST ?? '',
  DB_NAME: process.env.DB_NAME ?? '',
  DB_PASSWORD: process.env.DB_PASSWORD ?? '',
  DB_PORT: +(process.env.DB_PORT ?? 5432),
  MAIL_HOST: process.env.MAIL_HOST ?? 'smtp.gmail.com',
  MAIL_PORT: +(process.env.MAIL_PORT ?? 465),
  MAIL_SECURE: (process.env.MAIL_SECURE ?? 'true') === 'true',
  MAIL_USER: process.env.MAIL_USER ?? '',
  MAIL_PASS: process.env.MAIL_PASS ?? '',
  MAIL_FROM: process.env.MAIL_FROM ?? '',
  APP_BASE_URL: process.env.APP_BASE_URL ?? 'http://localhost:3000',
  REDIS_HOST: process.env.REDIS_HOST ?? 'redis',
  REDIS_PORT: +(process.env.REDIS_PORT ?? 6379),
  REDIS_TTL: +(process.env.REDIS_TTL ?? 300), // 5 min.
  REDIS_DEFAULT_TTL: +(process.env.REDIS_DEFAULT_TTL ?? 604800), // 7 days.
  OPENWEATHERMAP_API_KEY: process.env.OPENWEATHERMAP_API_KEY ?? '',
  OPENWEATHERMAP_BASE_URL: process.env.OPENWEATHERMAP_BASE_URL ?? '',
});

checkEnv(ENV, ConfigError);

export default ENV;
