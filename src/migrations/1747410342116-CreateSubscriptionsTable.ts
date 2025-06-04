import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionsTable1747410342116
	implements MigrationInterface
{
	name = 'CreateSubscriptionsTable1747410342116';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

		await queryRunner.query(`
      CREATE TABLE "subscriptions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "email" varchar(255) NOT NULL,
        "city" varchar(100) NOT NULL,
        "frequency" varchar(6) NOT NULL,
        "confirmed" boolean NOT NULL DEFAULT false,
        "confirmation_token" varchar(64) NOT NULL,
        "unsubscribe_token" varchar(64) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT email_city_frequency_unique UNIQUE ("email","city","frequency")
      );
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP TABLE "subscriptions";`);
	}
}
