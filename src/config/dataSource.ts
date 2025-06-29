import 'reflect-metadata';
import { DataSource } from 'typeorm';
import ENV from './env';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  username: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_NAME,
  entities: [__dirname + '/../models/*.entity.{js,ts}'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: false,
});
