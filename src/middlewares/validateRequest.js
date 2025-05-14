export const validateRequest =
	(schema, property = 'body') =>
	(req, res, next) => {
		const { error, value } = schema.validate(req[property]);

		if (error) return next(error);

		req[property === 'query' ? 'validatedQuery' : property] = value;
		next();
	};
