import { Fragment } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { getTableColumns } from './table-configuration';

const TransactionTable = ({
  transactions = [],
  totalCount = 0,
  pageSize,
  currentPage,
  onPageChange,
  handleSort,
  sortBy,
  sortOrder,
  isLoading,
  handleDeleteTransaction,
  confirmDialogVisible,
  deletedTransactionDescription,
  acceptDeletion,
  rejectDeletion,
  handleEditTransaction,
  homeCurrency,
}) => {
  const tableColumns = getTableColumns(homeCurrency);

  const renderEmptyMessage = () => {
    return (
      <Message
        severity="info"
        text="No transactions found. Click 'Add Transaction' to create your first transaction."
      />
    );
  };

  const getConfirmationModalMessage = () => {
    return (
      <div>
        Are you sure you want to delete the transaction <b>&quot;{deletedTransactionDescription}&quot;</b>?
      </div>
    );
  };

  const renderColumn = () => {
    return tableColumns.map((column) => {
      return <Column {...column} key={column.header} />;
    });
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}>
        <Button 
          icon="pi pi-pencil" 
          rounded 
          outlined 
          severity="info" 
          onClick={() => handleEditTransaction(rowData)} 
          tooltip="Edit transaction"
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-trash" 
          rounded 
          outlined 
          severity="danger" 
          onClick={() => handleDeleteTransaction(rowData)} 
          tooltip="Delete transaction"
          tooltipOptions={{ position: 'top' }}
        />
      </div>
    );
  };

  return (
    <div>
      <DataTable
        emptyMessage={renderEmptyMessage}
        className="border-1 surface-border border-round-md"
        value={transactions}
        showGridlines
        paginator
        onPage={onPageChange}
        rows={pageSize}
        first={currentPage * pageSize}
        lazy={true}
        totalRecords={totalCount}
        rowsPerPageOptions={[5, 10, 25, 50]}
        onSort={handleSort}
        sortField={sortBy}
        sortOrder={sortOrder}
        loading={isLoading}
        paginatorLeft
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        stripedRows
        responsiveLayout="scroll"
      >
        {renderColumn()}
        <Column
          header="Actions"
          style={{ width: '10rem' }}
          align="center"
          body={actionBodyTemplate}
          frozen
          alignFrozen="right"
        />
      </DataTable>
      
      <ConfirmDialog
        visible={confirmDialogVisible}
        onHide={rejectDeletion}
        message={getConfirmationModalMessage}
        header="Delete Transaction"
        icon="pi pi-exclamation-triangle"
        accept={acceptDeletion}
        reject={rejectDeletion}
        position="top"
        dismissableMask={true}
        acceptClassName="p-button-danger"
        acceptLabel="Delete"
        rejectLabel="Cancel"
      />
    </div>
  );
};

export default TransactionTable;