import { Client } from 'pg';

const {
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  TEST_DB_NAME = 'weatherdb',
} = process.env;

const SYSTEM_DB = process.env.PG_SYSTEM_DB ?? 'postgres';

async function createTestDb(): Promise<void> {
  const host = DB_HOST === 'localhost' ? '127.0.0.1' : DB_HOST;

  const client = new Client({
    user: DB_USER,
    host: host,
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
      return;
    }

    await client.query(`CREATE DATABASE "${TEST_DB_NAME}";`);
  } catch {
    process.exit(1);
  } finally {
    await client.end();
  }
}

createTestDb();
