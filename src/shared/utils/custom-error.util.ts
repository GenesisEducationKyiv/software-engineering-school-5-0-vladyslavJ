import { StatusCodes } from 'http-status-codes';
export class HttpError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}

export class ConfigError extends Error {
  status: number;
  constructor(message: string, status: number = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.name = 'ConfigError';
    this.status = status;
  }
}

export class ValidationError extends HttpError {
  status: number;
  constructor(message: string, status: number = StatusCodes.BAD_REQUEST) {
    super(message, status);
    this.name = 'ValidationError';
    this.status = status;
  }
}
