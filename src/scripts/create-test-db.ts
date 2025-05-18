// scripts/create-test-db.ts

import { Client } from 'pg';

// Дані для підключення до postgres (до "postgres" або іншої системної БД)
const {
	DB_USER = 'postgres',
	DB_PASSWORD = '',
	DB_HOST = 'localhost',
	DB_PORT = '5432',
	TEST_DB_NAME = 'weatherdb_test',
} = process.env;

// Для створення БД підключаємось до системної БД
const SYSTEM_DB = process.env.PG_SYSTEM_DB || 'postgres'; // або template1

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

		// Перевірити чи існує база
		const check = await client.query(
			`SELECT 1 FROM pg_database WHERE datname='${TEST_DB_NAME}';`
		);
		if (check.rowCount === 0 || check.rowCount === null) {
			console.log(`Database "${TEST_DB_NAME}" already exists!`);
			return;
		}

		// Створити БД
		await client.query(`CREATE DATABASE "${TEST_DB_NAME}";`);
		console.log(`Database "${TEST_DB_NAME}" successfully created!`);
	} catch (err: any) {
		console.error('Error creating test database:', err.message || err);
		process.exit(1);
	} finally {
		await client.end();
	}
}

createTestDb();
