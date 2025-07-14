import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';
import ENV from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  entities: [path.join(__dirname, '/../database/entities/**/*{.ts,.js}')],
  migrations: [path.join(__dirname, '/../database/migrations/**/*{.ts,.js}')],
  synchronize: false,
  logging: false,
});
