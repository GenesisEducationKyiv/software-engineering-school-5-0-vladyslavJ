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
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ConfigError';
    this.status = status;
  }
}

export class ValidationError extends HttpError {
  status: number;
  constructor(message: string, status = 400) {
    super(message, status);
    this.name = 'ValidationError';
    this.status = status;
  }
}
