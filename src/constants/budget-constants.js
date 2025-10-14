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

// TODO: Implement currency-specific thresholds or base currency normalization
// Currently using simple large number detection that works across all currencies
// Future improvement: Define thresholds per currency or convert to base currency

// Warning thresholds for unusually large budget amounts (per period)
// These are extremely high values that would be unusual in ANY currency
export const BUDGET_WARNING_THRESHOLDS = {
  [BUDGET_PERIOD_ENUM.WEEKLY]: 1000000, // 1 million per week
  [BUDGET_PERIOD_ENUM.MONTHLY]: 5000000, // 5 million per month
  [BUDGET_PERIOD_ENUM.QUARTERLY]: 15000000, // 15 million per quarter
  [BUDGET_PERIOD_ENUM.YEARLY]: 50000000, // 50 million per year
};

// Helper function to check if budget amount is unusually large
export const isUnusuallyLargeBudget = (amount, period) => {
  const threshold = BUDGET_WARNING_THRESHOLDS[period];
  return amount > threshold;
};