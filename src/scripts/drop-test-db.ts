import 'reflect-metadata';
import '../container';
import { container } from 'tsyringe';
import { ILogger } from '../interfaces/logger.service.interface';
import { TOKENS } from '../config/di.tokens';
import { Client } from 'pg';

const logger = container.resolve<ILogger>(TOKENS.ILogger);

const {
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  TEST_DB_NAME = 'mydb_test',
} = process.env;

const SYSTEM_DB = process.env.PG_SYSTEM_DB ?? 'postgres';

async function dropTestDb(): Promise<void> {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    port: Number(DB_PORT),
    password: DB_PASSWORD,
    database: SYSTEM_DB,
  });

  try {
    await client.connect();
    await client.query(
      `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid();
      `,
      [TEST_DB_NAME],
    );
    logger.info(`All connections to "${TEST_DB_NAME}" have been terminated.`);

    await client.query(`DROP DATABASE IF EXISTS "${TEST_DB_NAME}";`);
    logger.info(`Database "${TEST_DB_NAME}" successfully deleted (or did not exist)`);
  } catch (err: unknown) {
    logger.error('Error deleting test database', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropTestDb();
