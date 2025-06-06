import Joi from 'joi';

export const subscriptionBodySchema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': "The 'email' parameter is required.",
    'string.empty': "The 'email' parameter cannot be empty.",
    'string.email': "The 'email' parameter must be a valid email address.",
  }),
  city: Joi.string().trim().min(2).max(100).required().messages({
    'any.required': "The 'city' parameter is required.",
    'string.empty': "The 'city' parameter cannot be empty.",
    'string.min': "The 'city' parameter must contain at least 2 characters",
    'string.max': "The 'city' parameter cannot exceed 100 characters.",
  }),
  frequency: Joi.string().valid('hourly', 'daily').required().messages({
    'any.required': "The 'frequency' parameter is required.",
    'any.only': "The 'frequency' parameter must be either 'hourly' or 'daily'.",
    'string.empty': "The 'frequency' parameter cannot be empty.",
  }),
});
