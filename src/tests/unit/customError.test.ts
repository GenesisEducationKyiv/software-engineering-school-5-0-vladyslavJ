// src/tests/unit/customError.test.ts

import { HttpError, ConfigError } from '../../utils/customError';

describe('CustomError', () => {
	it('HttpError створюється з правильними параметрами', () => {
		const err = new HttpError('Test error', 418);
		expect(err.message).toBe('Test error');
		expect(err.status).toBe(418);
		expect(err.name).toBe('HttpError');
	});

	it('ConfigError створюється з правильними параметрами', () => {
		const err = new ConfigError('Bad config', 500);
		expect(err.message).toBe('Bad config');
		expect(err.status).toBe(500);
		expect(err.name).toBe('ConfigError');
	});
});
