export const amountTemplate = (rowData, homeCurrency) => {
  const formattedAmount = new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency: rowData.currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rowData.amount);

  const isHomeCurrency = rowData.currencyId === homeCurrency?.id;

  return (
    <div className="flex flex-column gap-1">
      <span className="text-red-600 font-semibold">
        {formattedAmount}
      </span>
      {!isHomeCurrency && (
        <span className="text-sm text-500">
          ≈ {rowData.convertedAmount.toFixed(2)} {rowData.convertedCurrencyCode} @ {rowData.exchangeRate}
        </span>
      )}
    </div>
  );
};

export const categoryTemplate = (rowData) => {
  return (
    <div className="flex align-items-center gap-2">
      <span>{rowData.categoryName}</span>
    </div>
  );
};

export const dateTemplate = (rowData) => {
  return new Date(rowData.date).toLocaleDateString('sv-SE');
};

export const getTableColumns = (homeCurrency) => {
  return [
    {
      header: 'Description',
      field: 'description',
      align: 'left',
      sortable: true,
      style: { minWidth: '15rem' },
    },
    {
      header: 'Amount',
      field: 'amount',
      body: (rowData) => amountTemplate(rowData, homeCurrency),
      align: 'left',
      sortable: true,
      style: { minWidth: '12rem' },
    },
    {
      header: 'Category',
      field: 'categoryName',
      body: categoryTemplate,
      align: 'left',
      sortable: true,
      style: { width: '12rem' },
    },
    {
      header: 'Date',
      field: 'date',
      body: dateTemplate,
      align: 'center',
      sortable: true,
      style: { width: '10rem' },
    },
  ];
};