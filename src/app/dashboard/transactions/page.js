'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import TransactionTable from './components/transaction-table';
import TransactionForm from './components/transaction-form';
import {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
  updateTransactionStart,
  updateTransactionSuccess,
  updateTransactionFailure,
  deleteTransactionStart,
  deleteTransactionSuccess,
  deleteTransactionFailure,
  fetchSummaryStart,
  fetchSummarySuccess,
  fetchSummaryFailure,
  setSelectedTransaction,
  selectTransactions,
  selectTransactionLoading,
  selectTransactionTotalCount,
  selectTransactionSummary,
  selectSelectedTransaction,
} from '@/redux/feature/transaction-slice';
import { selectUser } from '@/redux/feature/auth-slice';
import { transactionService } from '@/services';
import { TRANSACTION_TYPE_OPTIONS, TRANSACTION_TYPE_ENUM } from '@/constants/transaction-constants';
import './styles.scss';

const TransactionsPage = () => {
  const dispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const isLoading = useSelector(selectTransactionLoading);
  const totalCount = useSelector(selectTransactionTotalCount);
  const summary = useSelector(selectTransactionSummary);
  const selectedTransaction = useSelector(selectSelectedTransaction);
  const user = useSelector(selectUser);

  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState('Date');
  const [sortOrder, setSortOrder] = useState(-1);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [dateRange, setDateRange] = useState([null, null]);

  const typeOptions = [
    { label: 'All Types', value: '' },
    ...TRANSACTION_TYPE_OPTIONS,
  ];

  useEffect(() => {
    fetchTransactionsData();
    fetchSummaryData();
  }, [currentPage, pageSize, sortBy, sortOrder, searchTerm, typeFilter, dateRange]);

  const fetchTransactionsData = async () => {
    dispatch(fetchTransactionsStart());
    try {
      const params = {
        pageNumber: currentPage + 1,
        pageSize,
        sortBy,
        sortOrder: sortOrder === 1 ? 'asc' : 'desc',
      };

      if (searchTerm) params.searchTerm = searchTerm;
      if (typeFilter) params.type = typeFilter;
      if (dateRange[0]) params.startDate = dateRange[0].toISOString();
      if (dateRange[1]) params.endDate = dateRange[1].toISOString();

      const response = await transactionService.getTransactions(params);
      
      dispatch(fetchTransactionsSuccess({
        data: response.data || [],
        totalCount: response.totalCount || 0,
        pageNumber: response.pageNumber || 1,
        pageSize: response.pageSize || 10,
      }));
    } catch (error) {
      dispatch(fetchTransactionsFailure(error.message || 'Failed to fetch transactions'));
    }
  };

  const fetchSummaryData = async () => {
    dispatch(fetchSummaryStart());
    try {
      const params = {};
      if (dateRange[0]) params.startDate = dateRange[0].toISOString();
      if (dateRange[1]) params.endDate = dateRange[1].toISOString();

      const response = await transactionService.getTransactionSummary(params);
      dispatch(fetchSummarySuccess(response));
    } catch (error) {
      dispatch(fetchSummaryFailure(error.message || 'Failed to fetch summary'));
    }
  };

  const handleSort = (e) => {
    setSortBy(e.sortField);
    setSortOrder(e.sortOrder);
    setCurrentPage(0);
  };

  const onPageChange = (e) => {
    if (pageSize !== e.rows) {
      setPageSize(e.rows);
      setCurrentPage(0);
    } else if (currentPage !== e.page) {
      setCurrentPage(e.page);
    }
  };

  const handleAddTransaction = () => {
    dispatch(setSelectedTransaction(null));
    setIsSidebarVisible(true);
  };

  const handleEditTransaction = (transaction) => {
    dispatch(setSelectedTransaction(transaction));
    setIsSidebarVisible(true);
  };

  const handleDeleteTransaction = (transaction) => {
    setTransactionToDelete(transaction);
    setConfirmDialogVisible(true);
  };

  const acceptDeletion = async () => {
    if (transactionToDelete) {
      dispatch(deleteTransactionStart());
      try {
        await transactionService.deleteTransaction(transactionToDelete.id);
        dispatch(deleteTransactionSuccess(transactionToDelete.id));
        await fetchSummaryData();
      } catch (error) {
        dispatch(deleteTransactionFailure(error.message || 'Failed to delete transaction'));
      } finally {
        setTransactionToDelete(null);
        setConfirmDialogVisible(false);
      }
    }
  };

  const rejectDeletion = () => {
    setTransactionToDelete(null);
    setConfirmDialogVisible(false);
  };

  const handleTransactionSubmit = async (payload, transactionId = null) => {
    if (transactionId) {
      dispatch(updateTransactionStart());
      try {
        const response = await transactionService.updateTransaction(transactionId, payload);
        dispatch(updateTransactionSuccess(response));
        await fetchTransactionsData();
        await fetchSummaryData();
        setIsSidebarVisible(false);
      } catch (error) {
        dispatch(updateTransactionFailure(error.message || 'Failed to update transaction'));
        throw error;
      }
    } else {
      dispatch(createTransactionStart());
      try {
        const response = await transactionService.createTransaction(payload);
        dispatch(createTransactionSuccess(response));
        await fetchTransactionsData();
        await fetchSummaryData();
        setIsSidebarVisible(false);
      } catch (error) {
        dispatch(createTransactionFailure(error.message || 'Failed to create transaction'));
        throw error;
      }
    }
  };

  const handleSearch = () => {
    setCurrentPage(0);
    fetchTransactionsData();
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('');
    setDateRange([null, null]);
    setCurrentPage(0);
  };

  const formatCurrency = (amount, currencyCode, currencySymbol) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const renderSummary = () => {
    if (!summary) return null;

    return (
      <div className="transaction-summary">
        {/* TEMPORARILY HIDDEN - Total Income Card
        <div className="summary-card">
          <div className="summary-title">Total Income</div>
          <div className="summary-amount income">
            {formatCurrency(summary.totalIncome || 0, summary.homeCurrencyCode, summary.homeCurrencySymbol)}
          </div>
          <div className="summary-count">
            {summary.topIncomeCategories?.reduce((sum, cat) => sum + cat.transactionCount, 0) || 0} transactions
          </div>
        </div>
        */}
        <div className="summary-card">
          <div className="summary-title">Total Expenses</div>
          <div className="summary-amount expense">
            {formatCurrency(summary.totalExpenses || 0, summary.homeCurrencyCode, summary.homeCurrencySymbol)}
          </div>
          <div className="summary-count">
            {summary.topExpenseCategories?.reduce((sum, cat) => sum + cat.transactionCount, 0) || 0} transactions
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-title">Net Amount</div>
          <div className={`summary-amount ${summary.netAmount >= 0 ? 'income' : 'expense'}`}>
            {formatCurrency(summary.netAmount || 0, summary.homeCurrencyCode, summary.homeCurrencySymbol)}
          </div>
          <div className="summary-count">{summary.totalTransactions || 0} total</div>
        </div>
      </div>
    );
  };

  const renderFilters = () => {
    return (
      <div className="transaction-filters">
        <div className="filter-item">
          <label>Search</label>
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search transactions..."
            className="w-full"
          />
        </div>
        <div className="filter-item">
          <label>Type</label>
          <Dropdown
            value={typeFilter}
            options={typeOptions}
            onChange={(e) => setTypeFilter(e.value)}
            className="w-full"
          />
        </div>
        <div className="filter-item">
          <label>Date Range</label>
          <Calendar
            value={dateRange}
            onChange={(e) => setDateRange(e.value)}
            selectionMode="range"
            readOnlyInput
            className="w-full"
            dateFormat="yy-mm-dd"
          />
        </div>
        <div className="filter-actions">
          <Button
            label="Search"
            icon="pi pi-search"
            onClick={handleSearch}
            size="small"
          />
          <Button
            label="Clear"
            icon="pi pi-times"
            onClick={handleClearFilters}
            size="small"
            severity="secondary"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="transactions-container">
      <div className="transactions-header">
        <h1>All Transactions</h1>
        <Button
          label="Add Transaction"
          icon="pi pi-plus"
          onClick={handleAddTransaction}
        />
      </div>

      {renderSummary()}
      {renderFilters()}

      <TransactionTable
        transactions={transactions}
        totalCount={totalCount}
        pageSize={pageSize}
        currentPage={currentPage}
        onPageChange={onPageChange}
        handleSort={handleSort}
        sortBy={sortBy}
        sortOrder={sortOrder}
        isLoading={isLoading}
        handleDeleteTransaction={handleDeleteTransaction}
        confirmDialogVisible={confirmDialogVisible}
        deletedTransactionDescription={transactionToDelete?.description}
        acceptDeletion={acceptDeletion}
        rejectDeletion={rejectDeletion}
        handleEditTransaction={handleEditTransaction}
        homeCurrency={user?.homeCurrency}
      />

      <TransactionForm
        isVisible={isSidebarVisible}
        setIsVisible={setIsSidebarVisible}
        selectedTransaction={selectedTransaction}
        setSelectedTransaction={(transaction) => dispatch(setSelectedTransaction(transaction))}
        onSubmit={handleTransactionSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TransactionsPage;