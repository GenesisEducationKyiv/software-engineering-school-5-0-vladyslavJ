import { injectable } from 'tsyringe';
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { ILogger } from '../interfaces/logger.service.interface';

@injectable()
export class LoggerService implements ILogger {
  private readonly logger: WinstonLogger;

  constructor() {
    const logsDir = join(__dirname, '../../logs');
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

  info(message: string): void {
    this.logger.info(message);
  }

  warn(message: string): void {
    this.logger.warn(message);
  }

  error(message: string, error?: unknown): void {
    let text = message;

    if (error instanceof Error) {
      text += ` — ${error.stack ?? error.message}`;
    } else if (typeof error === 'object' && error !== null) {
      try {
        text += ` — ${JSON.stringify(error)}`;
      } catch {
        text += ' — [Unserializable object]';
      }
    } else if (typeof error === 'string') {
      text += ` — ${error}`;
    }

    this.logger.error(text);
  }
}
