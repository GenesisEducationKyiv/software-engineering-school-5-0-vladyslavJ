import { createLogger, format, transports } from 'winston';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const logsDir = join(__dirname, '../../logs');
if (!existsSync(logsDir)) mkdirSync(logsDir);

export const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(
			({ timestamp, level, message }) =>
				`${timestamp} [${level}]: ${message}`
		)
	),
	transports: [
		new transports.Console(),
		new transports.File({ filename: join(logsDir, 'app.log') }),
	],
});
