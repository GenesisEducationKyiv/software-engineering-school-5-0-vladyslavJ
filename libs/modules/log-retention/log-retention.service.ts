import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { RetentionPeriodsInterface } from './interfaces/retention-periods.interface';
import { LoggerInterface } from '../logger/interfaces/logger.interface';
import { LoggerDiTokens } from '../logger/di/di-tokens';

const ARCHIVE_DIR_NAME = 'archive';

@Injectable()
export class LogRetentionService {
  private readonly retentionPeriods: RetentionPeriodsInterface;
  private readonly logDir: string;
  private readonly archiveDir: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(LoggerDiTokens.LOGGER)
    private readonly logger: LoggerInterface,
  ) {
    this.retentionPeriods = {
      error: this.configService.get<number>('logger.retention.error', 90),
      warn: this.configService.get<number>('logger.retention.warn', 30),
      info: this.configService.get<number>('logger.retention.info', 14),
      debug: this.configService.get<number>('logger.retention.debug', 7),
    };

    this.logDir = this.configService.get<string>(
      'logger.path',
      path.resolve(process.cwd(), 'logs'),
    );
    this.archiveDir = path.join(this.logDir, ARCHIVE_DIR_NAME);

    this.logger.setContext(LogRetentionService.name);

    this.logger.info(`Log retention periods configured: ${JSON.stringify(this.retentionPeriods)}`);
    this.logger.info(`Log directory set to: ${this.logDir}`);
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleLogRetention() {
    this.logger.info('Starting scheduled log retention job');
    await this.manageLogRetention();
  }

  async manageLogRetention(): Promise<void> {
    try {
      await fs.access(this.logDir);
    } catch {
      this.logger.info('Log directory does not exist. Nothing to clean up.');
      return;
    }

    try {
      await fs.mkdir(this.archiveDir, { recursive: true });
    } catch (error) {
      this.logger.error(`Failed to create archive directory: ${this.archiveDir}`, error);
      return;
    }

    try {
      this.logger.info('Starting log retention process...');
      const files = await fs.readdir(this.logDir);
      const today = new Date();

      for (const file of files) {
        const filePath = path.join(this.logDir, file);
        const stat = await fs.stat(filePath);

        if (stat.isDirectory() || !file.endsWith('.log')) {
          continue;
        }

        const match = file.match(/^([a-z]+)-(\d{4}-\d{2}-\d{2})\.log$/);
        if (!match) {
          this.logger.warn(`Skipping non-standard log file: ${file}`);
          continue;
        }

        const [, level, dateStr] = match;
        const logDate = new Date(dateStr);
        const logAge = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

        const retentionPeriod =
          this.retentionPeriods[level as keyof RetentionPeriodsInterface] || 7;

        if (level === 'error' && logAge > retentionPeriod) {
          await this.archiveErrorLog(filePath);
        } else if (logAge > retentionPeriod) {
          await this.deleteLog(filePath, level, logAge, retentionPeriod);
        }
      }

      this.logger.info('Log retention process completed successfully.');
    } catch (error) {
      this.logger.error('Error during log retention process:', error);
    }
  }

  private async archiveErrorLog(filePath: string): Promise<void> {
    try {
      const fileName = path.basename(filePath);
      const archiveFilePath = path.join(this.archiveDir, fileName);

      await fs.rename(filePath, archiveFilePath);
      this.logger.info(`Archived error log: ${fileName}`);
    } catch (error) {
      this.logger.error(`Error archiving error log ${filePath}:`, error);
    }
  }

  private async deleteLog(
    filePath: string,
    level: string,
    age: number,
    retentionPeriod: number,
  ): Promise<void> {
    try {
      await fs.unlink(filePath);
      this.logger.info(
        `Deleted ${level} log: ${path.basename(
          filePath,
        )} (age: ${age} days, retention period: ${retentionPeriod} days)`,
      );
    } catch (error) {
      this.logger.error(`Error deleting log ${filePath}:`, error);
    }
  }
}
