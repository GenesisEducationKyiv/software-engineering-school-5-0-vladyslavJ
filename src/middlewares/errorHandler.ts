import { Request, Response, NextFunction } from 'express';
import { HttpError, ConfigError } from '../utils/customError';
import { logger } from '../utils/logger';

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	if (err.isJoi) {
		logger.warn(`Joi error: ${err.message}`);
		res.status(400).json({ message: err.message });
		return;
	}

	if (err instanceof HttpError || err instanceof ConfigError) {
		res.status(err.status).json({ message: err.message });
		return;
	}

	logger.error(err.stack || err);
	res.status(500).json({ message: 'Internal Server Error' });
};
