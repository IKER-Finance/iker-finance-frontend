export const BUDGET_PERIOD_ENUM = {
  DAILY: 0,
  WEEKLY: 1,
  MONTHLY: 2,
  QUARTERLY: 3,
  YEARLY: 4,
};

export const BUDGET_PERIOD_OPTIONS = [
  { label: 'Daily', value: BUDGET_PERIOD_ENUM.DAILY },
  { label: 'Weekly', value: BUDGET_PERIOD_ENUM.WEEKLY },
  { label: 'Monthly', value: BUDGET_PERIOD_ENUM.MONTHLY },
  { label: 'Quarterly', value: BUDGET_PERIOD_ENUM.QUARTERLY },
  { label: 'Yearly', value: BUDGET_PERIOD_ENUM.YEARLY },
];

export const BUDGET_PERIOD_MAP = {
  [BUDGET_PERIOD_ENUM.DAILY]: 'Daily',
  [BUDGET_PERIOD_ENUM.WEEKLY]: 'Weekly',
  [BUDGET_PERIOD_ENUM.MONTHLY]: 'Monthly',
  [BUDGET_PERIOD_ENUM.QUARTERLY]: 'Quarterly',
  [BUDGET_PERIOD_ENUM.YEARLY]: 'Yearly',
};