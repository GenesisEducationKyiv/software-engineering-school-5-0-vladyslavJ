import { checkEnv } from '../../utils/checkEnv';
import { ConfigError } from '../../utils/customError';

describe('checkEnv', () => {
	it('кидає помилку, якщо значення undefined', () => {
		expect(() => checkEnv({ A: undefined }, ConfigError)).toThrow(
			/A is undefined or empty/
		);
	});

	it('кидає помилку, якщо значення пустий рядок', () => {
		expect(() => checkEnv({ B: '' }, ConfigError)).toThrow(
			/B is undefined or empty/
		);
	});

	it('не кидає помилку, якщо все заповнено', () => {
		expect(() => checkEnv({ C: 'ok', D: 1 }, ConfigError)).not.toThrow();
	});
});
