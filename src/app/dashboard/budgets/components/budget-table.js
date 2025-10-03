import { Fragment } from 'react';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { getTableColumns } from './table-configuration';

const BudgetTable = ({
  budgets = [],
  totalCount = 0,
  pageSize,
  currentPage,
  onPageChange,
  handleSort,
  sortBy,
  sortOrder,
  isLoading,
  handleDeleteBudget,
  confirmDialogVisible,
  deletedBudgetName,
  acceptDeletion,
  rejectDeletion,
  handleEditBudget,
}) => {
  const tableColumns = getTableColumns();

  const renderEmptyMessage = () => {
    return (
      <Message
        severity="info"
        text="No budgets found. Click 'Add Budget' to create your first budget."
      />
    );
  };

  const getConfirmationModalMessage = () => {
    return (
      <div>
        Are you sure you want to delete the budget <b>&quot;{deletedBudgetName}&quot;</b>?
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
      <Fragment>
        <Button 
          icon="pi pi-pencil" 
          rounded 
          outlined 
          severity="info" 
          onClick={() => handleEditBudget(rowData)} 
          className="mr-2"
          tooltip="Edit budget"
          tooltipOptions={{ position: 'top' }}
        />
        <Button 
          icon="pi pi-trash" 
          rounded 
          outlined 
          severity="danger" 
          onClick={() => handleDeleteBudget(rowData)} 
          tooltip="Delete budget"
          tooltipOptions={{ position: 'top' }}
        />
      </Fragment>
    );
  };

  return (
    <div>
      <DataTable
        emptyMessage={renderEmptyMessage}
        className="border-1 surface-border border-round-md"
        value={budgets}
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
          style={{ width: '8rem' }}
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
        header="Delete Budget"
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

export default BudgetTable;