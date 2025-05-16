import { MigrationInterface, QueryRunner } from 'typeorm';

export class TestMigrationts1747410411184 implements MigrationInterface {
	name = 'TestMigrationts1747410411184';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TABLE "test_migration" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar(50) NOT NULL
      );
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "test_migration";`);
	}
}
