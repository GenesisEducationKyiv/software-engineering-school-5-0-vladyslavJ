import { checkEnv } from '../../utils/checkEnv';
import { ConfigError } from '../../utils/customError';

describe('checkEnv', () => {
  it('throws if value is undefined', () => {
    expect(() => checkEnv({ A: undefined }, ConfigError)).toThrow(/A is undefined or empty/);
  });

  it('throws if value is an empty string', () => {
    expect(() => checkEnv({ B: '' }, ConfigError)).toThrow(/B is undefined or empty/);
  });

  it('does not throw if all values are set', () => {
    expect(() => checkEnv({ C: 'ok', D: 1 }, ConfigError)).not.toThrow();
  });
});
