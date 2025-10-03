import { Tag } from 'primereact/tag';
import { BUDGET_PERIOD_MAP } from '@/constants/budget-constants';

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

  return (
    <div className="flex flex-column gap-1">
      <span className="font-semibold">{formattedAmount}</span>
      {rowData.categories && rowData.categories.length > 0 && (
        <span className="text-sm text-500">
          {rowData.categories.length} {rowData.categories.length === 1 ? 'category' : 'categories'}
        </span>
      )}
    </div>
  );
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

export const getTableColumns = () => {
  return [
    {
      header: 'Budget Name',
      field: 'name',
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