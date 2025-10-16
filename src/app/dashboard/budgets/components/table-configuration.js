import { Tag } from 'primereact/tag';
import { BUDGET_PERIOD_MAP } from '@/constants/budget-constants';
import BudgetProgressBar from '@/components/budgets/budget-progress-bar';
import BudgetStatusBadge from '@/components/budgets/budget-status-badge';

export const budgetPeriodTemplate = (rowData) => {
  const periodLabel = BUDGET_PERIOD_MAP[rowData.period] || 'Unknown';
  return <Tag value={periodLabel} severity="info" />;
};

export const budgetStatusTemplate = (rowData) => {
  return (
    <Tag
      value={rowData.isActive ? 'Active' : 'Inactive'}
      severity={rowData.isActive ? 'success' : 'danger'}
    />
  );
};

export const budgetAmountTemplate = (rowData) => {
  const formattedAmount = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: rowData.currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rowData.amount);

  return <span className="font-semibold">{formattedAmount}</span>;
};

export const budgetDatesTemplate = (rowData) => {
  const startDate = new Date(rowData.startDate).toLocaleDateString('sv-SE');
  const endDate = new Date(rowData.endDate).toLocaleDateString('sv-SE');

  return (
    <div className="flex flex-column gap-1">
      <span>{startDate}</span>
      <span className="text-sm text-500">to {endDate}</span>
    </div>
  );
};

export const budgetSpentTemplate = (rowData) => {
  const summary = rowData.summary;

  if (!summary) {
    return <span className="text-500">Loading...</span>;
  }

  const formattedSpent = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: summary.currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(summary.spentAmount);

  return (
    <div className="flex flex-column gap-1">
      <span className="font-semibold">{formattedSpent}</span>
      <span className="text-xs text-500">
        of {new Intl.NumberFormat('sv-SE', {
          style: 'currency',
          currency: summary.currencyCode,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(summary.amount)}
      </span>
    </div>
  );
};

export const budgetRemainingTemplate = (rowData) => {
  const summary = rowData.summary;

  if (!summary) {
    return <span className="text-500">Loading...</span>;
  }

  const formattedRemaining = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: summary.currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(summary.remainingAmount);

  const isNegative = summary.remainingAmount < 0;

  return (
    <span
      className="font-semibold"
      style={{ color: isNegative ? '#EF4444' : '#10B981' }}
    >
      {formattedRemaining}
    </span>
  );
};

export const budgetProgressTemplate = (rowData) => {
  const summary = rowData.summary;

  if (!summary) {
    return <span className="text-500">Loading...</span>;
  }

  return (
    <BudgetProgressBar
      percentageSpent={summary.percentageSpent}
      status={summary.status}
      showPercentage={true}
    />
  );
};

export const budgetHealthStatusTemplate = (rowData) => {
  const summary = rowData.summary;

  if (!summary) {
    return null;
  }

  return <BudgetStatusBadge status={summary.status} size="normal" />;
};

export const getTableColumns = () => {
  return [
    {
      header: 'Category',
      field: 'categoryName',
      align: 'left',
      sortable: true,
      style: { minWidth: '12rem' },
    },
    {
      header: 'Amount',
      field: 'amount',
      body: budgetAmountTemplate,
      align: 'left',
      sortable: true,
      style: { minWidth: '10rem' },
    },
    {
      header: 'Spent',
      body: budgetSpentTemplate,
      align: 'left',
      style: { minWidth: '10rem' },
    },
    {
      header: 'Remaining',
      body: budgetRemainingTemplate,
      align: 'right',
      style: { minWidth: '9rem' },
    },
    {
      header: 'Progress',
      body: budgetProgressTemplate,
      align: 'left',
      style: { minWidth: '12rem' },
    },
    {
      header: 'Period',
      field: 'period',
      body: budgetPeriodTemplate,
      align: 'center',
      sortable: true,
      style: { width: '8rem' },
    },
    {
      header: 'Duration',
      field: 'startDate',
      body: budgetDatesTemplate,
      align: 'left',
      sortable: true,
      style: { minWidth: '12rem' },
    },
    {
      header: 'Status',
      field: 'isActive',
      body: budgetStatusTemplate,
      align: 'center',
      sortable: true,
      style: { width: '8rem' },
    },
  ];
};