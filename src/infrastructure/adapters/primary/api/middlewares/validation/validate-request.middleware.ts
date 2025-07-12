import { Schema } from 'joi';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../../../../../shared/utils/custom-error.util';

type ReqPart = 'body' | 'query' | 'params';

export function validateRequest<T>(schema: Schema<T>, property: ReqPart = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    const targetValue =
      property === 'body' ? req.body : property === 'query' ? req.query : req.params;

    const { error, value } = schema.validate(targetValue);

    if (error) {
      return next(new ValidationError(error.message));
    }

    if (property === 'body') {
      req.validatedBody = value;
    } else if (property === 'query') {
      req.validatedQuery = value;
    } else {
      req.validatedParams = value;
    }

    next();
  };
}
