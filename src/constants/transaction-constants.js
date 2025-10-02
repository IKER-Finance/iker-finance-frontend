export const TRANSACTION_TYPE_ENUM = {
  INCOME: 1,
  EXPENSE: 2,
};

export const TRANSACTION_TYPE_OPTIONS = [
  { label: 'Income', value: TRANSACTION_TYPE_ENUM.INCOME },
  { label: 'Expense', value: TRANSACTION_TYPE_ENUM.EXPENSE },
];

export const TRANSACTION_TYPE_MAP = {
  [TRANSACTION_TYPE_ENUM.INCOME]: 'Income',
  [TRANSACTION_TYPE_ENUM.EXPENSE]: 'Expense',
};