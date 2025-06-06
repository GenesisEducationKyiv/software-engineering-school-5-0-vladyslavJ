import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { logger } from '../utils/logger';

const [, , rawName] = process.argv;

if (!rawName) {
  logger.error('Using: npm run migration:create -- MigrationName');
  process.exit(1);
}

const MigrationName = rawName
  .trim()
  .replace(/[^A-Za-z0-9]/g, '')
  .replace(/^\w/, c => c.toUpperCase());

const timestamp = Date.now().toString();

const fileName = `${timestamp}-${MigrationName}.ts`;
const className = `${MigrationName}${timestamp}`;

const migrationsDir = resolve(__dirname, '../migrations');
if (!existsSync(migrationsDir)) {
  mkdirSync(migrationsDir, { recursive: true });
}

const content = `import { MigrationInterface, QueryRunner } from 'typeorm';

export class ${className} implements MigrationInterface {
  name = '${className}';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // TODO: add SQL queries here to create a new structure
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // TODO: add SQL queries here to roll back changes
  }
}
`;

const filePath = join(migrationsDir, fileName);
writeFileSync(filePath, content, { encoding: 'utf-8' });

logger.info(`Migration created: ${filePath}`);
