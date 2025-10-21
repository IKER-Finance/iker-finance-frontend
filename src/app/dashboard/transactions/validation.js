import Joi from 'joi';
import {
  textValidation,
  amountValidation,
  pastDateValidation,
  idValidation
} from '@/lib/validators/common-validators';

export const transactionValidationSchema = Joi.object({
  amount: amountValidation('Amount'),
  description: textValidation({
    name: 'Description',
    required: true,
    maxLength: 500,
    minLength: 3
  }),
  categoryId: idValidation('Category'),
  currencyId: idValidation('Currency'),
  date: pastDateValidation('Transaction date'),
  notes: textValidation({
    name: 'Notes',
    required: false,
    maxLength: 1000
  }),
});
