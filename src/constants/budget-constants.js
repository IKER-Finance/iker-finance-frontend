export const BUDGET_PERIOD_ENUM = {
  WEEKLY: 2,
  MONTHLY: 3,
  QUARTERLY: 4,
  YEARLY: 5,
};

export const BUDGET_PERIOD_OPTIONS = [
  { label: 'Weekly', value: BUDGET_PERIOD_ENUM.WEEKLY },
  { label: 'Monthly', value: BUDGET_PERIOD_ENUM.MONTHLY },
  { label: 'Quarterly', value: BUDGET_PERIOD_ENUM.QUARTERLY },
  { label: 'Yearly', value: BUDGET_PERIOD_ENUM.YEARLY },
];

export const BUDGET_PERIOD_MAP = {
  [BUDGET_PERIOD_ENUM.WEEKLY]: 'Weekly',
  [BUDGET_PERIOD_ENUM.MONTHLY]: 'Monthly',
  [BUDGET_PERIOD_ENUM.QUARTERLY]: 'Quarterly',
  [BUDGET_PERIOD_ENUM.YEARLY]: 'Yearly',
};

export const BUDGET_WARNING_THRESHOLDS = {
  [BUDGET_PERIOD_ENUM.WEEKLY]: 1000000,
  [BUDGET_PERIOD_ENUM.MONTHLY]: 5000000,
  [BUDGET_PERIOD_ENUM.QUARTERLY]: 15000000,
  [BUDGET_PERIOD_ENUM.YEARLY]: 50000000,
};

export const isUnusuallyLargeBudget = (amount, period) => {
  const threshold = BUDGET_WARNING_THRESHOLDS[period];
  return amount > threshold;
};
