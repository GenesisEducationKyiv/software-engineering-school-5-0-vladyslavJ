import { Injectable } from '@nestjs/common';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ILogger } from './interfaces/logger.interface';

@Injectable()
export class LoggerService implements ILogger {
  private readonly logger: WinstonLogger;

  constructor() {
    const logsDir = join(__dirname, '../../../logs');
    if (!existsSync(logsDir)) mkdirSync(logsDir);

    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: join(logsDir, 'app.log') }),
      ],
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  error(message: string, trace?: string) {
    this.logger.error(`${message}${trace ? ' — ' + trace : ''}`);
  }

  warn(message: string) {
    this.logger.warn(message);
  }
}
