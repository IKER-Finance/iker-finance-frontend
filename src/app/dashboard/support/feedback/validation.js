import Joi from 'joi';
import { FEEDBACK_TYPE_ENUM, FEEDBACK_PRIORITY_ENUM } from '@/constants/feedback-constants';

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

export const feedbackValidationSchema = Joi.object({
  type: Joi.number()
    .integer()
    .valid(...Object.values(FEEDBACK_TYPE_ENUM))
    .required()
    .messages({
      'any.required': 'Feedback type is required.',
      'number.base': 'Valid feedback type must be selected.',
      'any.only': 'Valid feedback type must be selected.',
    }),
  subject: textValidation({
    name: 'Subject',
    required: true,
    maxLength: 200,
    minLength: 5
  }),
  description: textValidation({
    name: 'Description',
    required: true,
    maxLength: 2000,
    minLength: 10
  }),
  priority: Joi.number()
    .integer()
    .valid(...Object.values(FEEDBACK_PRIORITY_ENUM))
    .required()
    .messages({
      'any.required': 'Priority is required.',
      'number.base': 'Valid priority must be selected.',
      'any.only': 'Valid priority must be selected.',
    }),
});
