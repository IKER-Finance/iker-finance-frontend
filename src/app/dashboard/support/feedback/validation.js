import Joi from 'joi';
import { textValidation } from '@/lib/validators/common-validators';
import { FEEDBACK_TYPE_ENUM, FEEDBACK_PRIORITY_ENUM } from '@/constants/feedback-constants';

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
