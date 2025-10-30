import Joi from 'joi';
import {
  textValidation,
  amountValidation,
  budgetDateValidation,
  idValidation
} from '@/lib/validators/common-validators';

export const budgetValidationSchema = Joi.object({
  categoryId: idValidation('Category'),
  amount: amountValidation('Budget amount'),
  currencyId: idValidation('Currency'),
  period: Joi.number()
    .integer()
    .min(2)
    .max(5)
    .required()
    .messages({
      'any.required': 'Budget period is required.',
      'number.base': 'Valid budget period must be selected.',
      'number.min': 'Valid budget period must be selected.',
      'number.max': 'Valid budget period must be selected.',
    }),
  startDate: budgetDateValidation('Start date'),
  description: textValidation({
    name: 'Description',
    required: false,
    maxLength: 500
  }),
});
