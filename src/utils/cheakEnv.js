import { ConfigError } from '../utils/customError.js';

export const checkEnv = (env) => {
    Object.entries(env).forEach(([key, value]) => {
        if (!value) {
            throw new ConfigError(
				`Check environment variable: ${key} is undefined or empty`
			);
        }
    });
};