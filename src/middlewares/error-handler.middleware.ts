import { injectable, inject } from 'tsyringe';
import { Request, Response, NextFunction } from 'express';
import { HttpError, ConfigError, ValidationError } from '../utils/custom-error.util';
import { ILogger } from '../interfaces/logger-service.interface';
import { TOKENS } from '../config/di-tokens.config';

@injectable()
export class ErrorHandlerMiddleware {
  constructor(@inject(TOKENS.ILogger) private readonly logger: ILogger) {}

  /* eslint-disable-next-line */
  public handle(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
    if (err instanceof ValidationError) {
      this.logger.warn(`ValidationError: ${err.message}`);
      res.status(err.status).json({ message: err.message });
      return;
    }

    if (err instanceof HttpError || err instanceof ConfigError) {
      res.status(err.status).json({ message: err.message });
      return;
    }

    if (err instanceof Error) {
      this.logger.error(err.message, err);
    } else {
      this.logger.error(String(err));
    }

    res.status(500).json({ message: 'Internal Server Error' });
  }
}
