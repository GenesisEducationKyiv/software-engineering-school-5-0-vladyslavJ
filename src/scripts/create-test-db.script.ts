import 'reflect-metadata';
import '../container';
import { container } from 'tsyringe';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';
import { Client } from 'pg';

const logger = container.resolve<ILogger>(TOKENS.ILogger);

const {
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  TEST_DB_NAME = 'weatherdb',
} = process.env;

const SYSTEM_DB = process.env.PG_SYSTEM_DB ?? 'postgres';

async function createTestDb(): Promise<void> {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    port: Number(DB_PORT),
    password: DB_PASSWORD,
    database: SYSTEM_DB,
  });

  try {
    await client.connect();

    const check = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1;`, [
      TEST_DB_NAME,
    ]);

    if ((check.rowCount ?? 0) > 0) {
      logger.info(`Test database "${TEST_DB_NAME}" already exists`);
      return;
    }

    await client.query(`CREATE DATABASE "${TEST_DB_NAME}";`);
    logger.info(`Test database "${TEST_DB_NAME}" successfully created`);
  } catch (err: unknown) {
    logger.error('Error creating test database', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestDb();
