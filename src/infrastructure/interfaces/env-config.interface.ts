export interface IEnvConfig {
  PORT: number;
  WEATHER_API_KEY: string;
  WEATHER_BASE_URL: string;
  DB_USER: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_PASSWORD: string;
  DB_PORT: number;
  MAIL_HOST: string;
  MAIL_PORT: number;
  MAIL_SECURE: boolean;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
  APP_BASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_TTL: number;
  OPENWEATHERMAP_API_KEY: string;
  OPENWEATHERMAP_BASE_URL: string;
  REDIS_DEFAULT_TTL: number;
}
