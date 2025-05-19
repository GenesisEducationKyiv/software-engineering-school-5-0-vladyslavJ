export class HttpError extends Error {
	status: number;
	constructor(message: string, status = 500) {
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
