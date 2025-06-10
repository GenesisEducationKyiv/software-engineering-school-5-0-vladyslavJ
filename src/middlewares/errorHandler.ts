import { Request, Response, NextFunction } from 'express';
import { HttpError, ConfigError, ValidationError } from '../utils/customError';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  /* eslint-disable-next-line */
  _next: NextFunction,
): void => {
  if (err instanceof ValidationError) {
    logger.warn(`ValidationError: ${err.message}`);
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err instanceof HttpError || err instanceof ConfigError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  if (err instanceof Error) {
    logger.error(err.stack || err.message);
  } else {
    logger.error(String(err));
  }

  res.status(500).json({ message: 'Internal Server Error' });
};
