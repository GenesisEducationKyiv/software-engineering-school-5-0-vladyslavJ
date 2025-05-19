export const checkEnv = <T extends Record<string, any>>(
	env: T,
	ErrorCtor: new (msg: string) => Error
): void => {
	for (const [key, value] of Object.entries(env)) {
		if (
			value === undefined ||
			value === null ||
			(typeof value === 'string' && value.trim() === '')
		) {
			throw new ErrorCtor(
				`Check environment variable: ${key} is undefined or empty`
			);
		}
	}
};
