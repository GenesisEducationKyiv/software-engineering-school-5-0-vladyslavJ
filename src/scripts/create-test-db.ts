import { Client } from 'pg';
import { logger } from '../utils/logger';

const {
	DB_USER = 'postgres',
	DB_PASSWORD = '',
	DB_HOST = 'localhost',
	DB_PORT = '5432',
	TEST_DB_NAME = 'weatherdb_test',
} = process.env;

const SYSTEM_DB = process.env.PG_SYSTEM_DB || 'postgres';

async function createTestDb() {
	const client = new Client({
		user: DB_USER,
		host: DB_HOST,
		port: +DB_PORT,
		password: DB_PASSWORD,
		database: SYSTEM_DB,
	});

	try {
		await client.connect();

		const check = await client.query(
			`SELECT 1 FROM pg_database WHERE datname='${TEST_DB_NAME}';`
		);
		if ((check.rowCount ?? 0) > 0) {
			logger.info(`Database "${TEST_DB_NAME}" already exists!`);
			return;
		}

		await client.query(`CREATE DATABASE "${TEST_DB_NAME}";`);
		logger.info(`Database "${TEST_DB_NAME}" successfully created!`);
	} catch (err: any) {
		logger.error('Error creating test database:', err.message || err);
		process.exit(1);
	} finally {
		await client.end();
	}
}

createTestDb();
