import Joi from 'joi';

export const validateSpaces = (fieldName) => (value, helpers) => {
  if (value.startsWith(' ')) {
    return helpers.message({ custom: `${fieldName} cannot have leading spaces.` });
  }
  if (value.endsWith(' ')) {
    return helpers.message({ custom: `${fieldName} cannot have trailing spaces.` });
  }
  if (value.includes('  ')) {
    return helpers.message({ custom: `${fieldName} cannot have multiple consecutive spaces.` });
  }
  return value;
};

export const textValidation = ({ name, required = false, maxLength = 255, minLength = 3 }) => {
  let schema = Joi.string()
    .custom(validateSpaces(name))
    .max(maxLength)
    .messages({
      'string.empty': `${name} is required.`,
      'string.min': `${name} must be at least ${minLength} characters long.`,
      'string.max': `${name} cannot be more than ${maxLength} characters.`,
    });

  if (required) {
    schema = schema.required().min(minLength);
  } else {
    schema = schema.allow(null, '');
  }

  return schema;
};

export const amountValidation = (name) =>
  Joi.number()
    .required()
    .min(0.01)
    .max(999999999.99)
    .precision(2)
    .messages({
      'any.required': `${name} is required.`,
      'number.base': `${name} must be a number.`,
      'number.min': `${name} must be at least 0.01.`,
      'number.max': `${name} cannot exceed 999,999,999.99.`,
      'number.precision': `${name} can have at most 2 decimal places.`,
    });

export const futureDateValidation = (name) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Joi.date()
    .required()
    .min(today)
    .messages({
      'any.required': `${name} is required.`,
      'date.base': `${name} must be a valid date.`,
      'date.min': `${name} cannot be in the past.`,
    });
};

export const budgetDateValidation = (name) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today);
  minDate.setMonth(minDate.getMonth() - 2);

  const maxDate = new Date(today);
  maxDate.setMonth(maxDate.getMonth() + 12);

  return Joi.date()
    .required()
    .min(minDate)
    .max(maxDate)
    .messages({
      'any.required': `${name} is required.`,
      'date.base': `${name} must be a valid date.`,
      'date.min': `${name} cannot be older than 2 months.`,
      'date.max': `${name} cannot be more than 12 months in the future.`,
    });
};

export const pastDateValidation = (name) => {
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return Joi.date()
    .required()
    .max(endOfToday)
    .messages({
      'any.required': `${name} is required.`,
      'date.base': `${name} must be a valid date.`,
      'date.max': `${name} cannot be in the future.`,
    });
};

export const idValidation = (name) =>
  Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'any.required': `${name} is required.`,
      'number.base': `Valid ${name.toLowerCase()} must be selected.`,
      'number.integer': `Valid ${name.toLowerCase()} must be selected.`,
      'number.min': `Valid ${name.toLowerCase()} must be selected.`,
    });
