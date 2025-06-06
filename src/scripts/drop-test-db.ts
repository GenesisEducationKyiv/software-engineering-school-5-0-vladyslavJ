import { Client } from 'pg';
import { logger } from '../utils/logger';

const {
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  TEST_DB_NAME = 'mydb_test',
} = process.env;

const SYSTEM_DB = process.env.PG_SYSTEM_DB || 'postgres';

async function dropTestDb() {
  const client = new Client({
    user: DB_USER,
    host: DB_HOST,
    port: +DB_PORT,
    password: DB_PASSWORD,
    database: SYSTEM_DB,
  });

  try {
    await client.connect();
    await client.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${TEST_DB_NAME}' AND pid <> pg_backend_pid();
    `);
    await client.query(`DROP DATABASE IF EXISTS "${TEST_DB_NAME}";`);
    logger.info(`Database "${TEST_DB_NAME}" dropped!`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('Error dropping test database:', message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

dropTestDb();
