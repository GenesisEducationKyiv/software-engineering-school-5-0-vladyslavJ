import { HttpError, ConfigError } from '../utils/customError.js';

export const errorHandler = (err, req, res, next) => {
	if (err.isJoi) {
		return res.status(400).json({ message: err.message });
	}

	if (err instanceof HttpError || err instanceof ConfigError) {
		return res.status(err.status).json({ message: err.message });
	}

	console.error(err);
	return res.status(500).json({ message: 'Internal Server Error' });
};
