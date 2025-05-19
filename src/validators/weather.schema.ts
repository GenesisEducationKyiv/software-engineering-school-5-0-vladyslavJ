import Joi from 'joi';

export const weatherQuerySchema = Joi.object({
	city: Joi.string().trim().min(2).max(100).required().messages({
		'any.required': "The 'city' parameter is required.",
		'string.empty': "The 'city' parameter cannot be empty.",
		'string.min': "The 'city' parameter must contain at least 2 characters",
		'string.max': "The 'city' parameter cannot exceed 100 characters.",
	}),
});
