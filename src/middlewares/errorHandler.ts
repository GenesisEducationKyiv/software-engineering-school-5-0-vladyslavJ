// src/middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';
import { HttpError, ConfigError } from '../utils/customError';

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
): void => {
	if (err.isJoi) {
		res.status(400).json({ message: err.message });
		return;
	}

	if (err instanceof HttpError || err instanceof ConfigError) {
		res.status(err.status).json({ message: err.message });
		return;
	}

	console.error(err);
	res.status(500).json({ message: 'Internal Server Error' });
};
