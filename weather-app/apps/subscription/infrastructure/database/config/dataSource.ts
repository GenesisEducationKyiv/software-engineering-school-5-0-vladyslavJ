import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as path from 'path';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [path.join(__dirname, '/../../../../../libs/common/models/**/*{.ts,.js}')],
  migrations: [path.join(__dirname, '/../migrations/**/*{.ts,.js}')],
  synchronize: false,
  logging: false,
});
