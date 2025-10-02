import Joi from 'joi';

const validateSpaces = (fieldName) => (value, helpers) => {
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

const textValidation = ({ name, required = false, maxLength = 255, minLength = 3 }) => {
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

const amountValidation = (name) =>
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

const dateValidation = (name) => {
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

export const transactionValidationSchema = Joi.object({
  amount: amountValidation('Amount'),
  description: textValidation({ 
    name: 'Description', 
    required: true, 
    maxLength: 500,
    minLength: 3 
  }),
  categoryId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'any.required': 'Category is required.',
      'number.base': 'Valid category must be selected.',
      'number.integer': 'Valid category must be selected.',
      'number.min': 'Valid category must be selected.',
    }),
  currencyId: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      'any.required': 'Currency is required.',
      'number.base': 'Valid currency must be selected.',
      'number.integer': 'Valid currency must be selected.',
      'number.min': 'Valid currency must be selected.',
    }),
  date: dateValidation('Transaction date'),
  notes: textValidation({ 
    name: 'Notes', 
    required: false, 
    maxLength: 1000 
  }),
});