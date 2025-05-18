// src/middlewares/validateRequest.ts

import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';

type ReqPart = 'body' | 'query' | 'params';

export const validateRequest =
	(schema: Schema, property: ReqPart = 'body') =>
	(req: Request, res: Response, next: NextFunction) => {
		const { error, value } = schema.validate((req as any)[property]);

		if (error) return next(error);

		if (property === 'query') (req as any).validatedQuery = value;
		else (req as any)[property] = value;
		next();
	};
