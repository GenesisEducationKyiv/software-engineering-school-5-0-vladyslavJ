export class HttpError extends Error {
	constructor(message, status = 500) {
		super(message);
		this.name = 'HttpError';
		this.status = status;
	}
}

export class ConfigError extends Error {
	constructor(message, status = 500) {
		super(message);
		this.name = 'ConfigError';
		this.status = status;
	}
}
