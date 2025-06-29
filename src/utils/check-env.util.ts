export const checkEnv = <T extends Record<string, string | number | boolean | undefined>>(
  env: T,
  ErrorCtor: new (_msg: string) => Error,
): void => {
  for (const [key, value] of Object.entries(env)) {
    if (
      value === undefined ||
      value === null ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      throw new ErrorCtor(`Check environment variable: ${key} is undefined or empty`);
    }
  }
};
