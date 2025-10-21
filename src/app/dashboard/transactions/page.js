'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
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
import { transactionService, categoryService } from '@/services';
import './styles.scss';
import styles from '../overview-page.module.css'; 

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
  const [categoryFilter, setCategoryFilter] = useState('');
  // TODO: Add date range filter state in future
  // const [dateRange, setDateRange] = useState([null, null]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchTransactionsData();
    fetchSummaryData();
  }, [currentPage, pageSize, sortBy, sortOrder, searchTerm, categoryFilter]);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      setCategories(response);
    } catch (error) {
    }
  };

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
      if (categoryFilter) params.categoryId = categoryFilter;
      // TODO: Add date range filter parameters in future
      // if (dateRange && dateRange[0]) params.startDate = dateRange[0].toISOString();
      // if (dateRange && dateRange[1]) params.endDate = dateRange[1].toISOString();

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
      // TODO: Add date range filter parameters in future
      // if (dateRange && dateRange[0]) params.startDate = dateRange[0].toISOString();
      // if (dateRange && dateRange[1]) params.endDate = dateRange[1].toISOString();

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
    setCategoryFilter('');
    // TODO: Reset date range filter in future
    // setDateRange([null, null]);
    setCurrentPage(0);
  };

  const formatCurrency = (amount, _currencyCode, currencySymbol) => {
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  const renderSummary = () => {
    if (!summary) return null;

    const expenseTransactionCount = summary.topExpenseCategories?.reduce((sum, cat) => sum + cat.transactionCount, 0) || 0;

    // Find top spending category
    const topCategory = summary.topExpenseCategories?.length > 0
      ? summary.topExpenseCategories.reduce((max, cat) =>
          cat.totalAmount > (max?.totalAmount || 0) ? cat : max,
          summary.topExpenseCategories[0]
        )
      : null;

    const topCategoryPercentage = topCategory && summary.totalExpenses > 0
      ? ((topCategory.totalAmount / summary.totalExpenses) * 100).toFixed(1)
      : 0;

    return (
      <div className="transaction-summary">
        <div className="summary-card">
          <div className="summary-title">Total Expenses</div>
          <div className="summary-amount expense">
            {formatCurrency(summary.totalExpenses || 0, summary.homeCurrencyCode, summary.homeCurrencySymbol)}
          </div>
          <div className="summary-count">
            {expenseTransactionCount} transaction{expenseTransactionCount !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-title">Top Category</div>
          {topCategory ? (
            <>
              <div className="summary-amount expense">
                {formatCurrency(topCategory.totalAmount || 0, summary.homeCurrencyCode, summary.homeCurrencySymbol)}
              </div>
              <div className="summary-count">
                {topCategory.categoryName} • {topCategoryPercentage}% of total
              </div>
            </>
          ) : (
            <>
              <div className="summary-amount" style={{ fontSize: '1.2rem', color: '#64748b' }}>
                No expenses yet
              </div>
              <div className="summary-count">Start tracking your spending</div>
            </>
          )}
        </div>
      </div>
    );
  };

  const categoryOptions = [
    { label: 'All Categories', value: '', id: '' },
    ...categories.filter(c => c.isActive).map(cat => ({
      label: cat.name,
      value: cat.id,
      id: cat.id
    }))
  ];

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
          <label>Category</label>
          <Dropdown
            value={categoryFilter}
            options={categoryOptions}
            onChange={(e) => setCategoryFilter(e.value)}
            optionLabel="label"
            optionValue="value"
            placeholder="Select category"
            className="w-full"
            filter
            showClear
          />
        </div>
        {/* TODO: Add date range filter in future - currently experiencing issues with Calendar range selection */}
        <div className="filter-actions">
          <label>Actions</label>
          <div className="buttons-wrapper">
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
      </div>
    );
  };

  return (
    <div className={`${styles.pageContainer} surface-ground min-h-screen`}>
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
    </div>
  );
};

export default TransactionsPage;