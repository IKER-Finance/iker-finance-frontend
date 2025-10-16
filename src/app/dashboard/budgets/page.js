'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import BudgetTable from './components/budget-table';
import BudgetForm from './components/budget-form';
import { budgetService } from '@/services';
import {
  fetchBudgetsStart,
  fetchBudgetsSuccess,
  fetchBudgetsFailure,
  createBudgetStart,
  createBudgetSuccess,
  createBudgetFailure,
  updateBudgetStart,
  updateBudgetSuccess,
  updateBudgetFailure,
  deleteBudgetStart,
  deleteBudgetSuccess,
  deleteBudgetFailure,
  setSelectedBudget,
  selectBudgets,
  selectBudgetLoading,
  selectBudgetTotalCount,
  selectSelectedBudget,
} from '@/redux/feature/budget-slice';
import styles from '../OverviewPage.module.css'; 

const BudgetsPage = () => {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const budgets = useSelector(selectBudgets);
  const loading = useSelector(selectBudgetLoading);
  const totalCount = useSelector(selectBudgetTotalCount);
  const selectedBudget = useSelector(selectSelectedBudget);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [filters, setFilters] = useState({
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'CreatedAt',
    sortOrder: 'desc',
    searchTerm: '',
  });

  useEffect(() => {
    fetchBudgets();
  }, [filters]);

  const fetchBudgets = async () => {
    dispatch(fetchBudgetsStart());
    try {
      const params = {
        PageNumber: filters.pageNumber,
        PageSize: filters.pageSize,
        SortBy: filters.sortBy,
        SortOrder: filters.sortOrder,
        SearchTerm: filters.searchTerm || undefined,
      };
      const response = await budgetService.getBudgets(params);

      // Fetch summaries for each budget
      const budgetsWithSummaries = await Promise.all(
        response.data.map(async (budget) => {
          try {
            const summary = await budgetService.getBudgetSummary(budget.id);
            return { ...budget, summary };
          } catch (error) {
            console.error(`Failed to fetch summary for budget ${budget.id}:`, error);
            return budget; // Return budget without summary on error
          }
        })
      );

      dispatch(fetchBudgetsSuccess({
        ...response,
        data: budgetsWithSummaries
      }));
    } catch (error) {
      dispatch(fetchBudgetsFailure(error.message));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      });
    }
  };

  const handleCreateBudget = async (budgetData) => {
    dispatch(createBudgetStart());
    try {
      const response = await budgetService.createBudget(budgetData);
      dispatch(createBudgetSuccess(response));
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Budget created successfully',
        life: 3000,
      });
      setIsFormVisible(false);
      fetchBudgets();
    } catch (error) {
      dispatch(createBudgetFailure(error.message));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      });
      throw error;
    }
  };

  const handleUpdateBudget = async (budgetData, budgetId) => {
    dispatch(updateBudgetStart());
    try {
      const response = await budgetService.updateBudget(budgetId, budgetData);
      dispatch(updateBudgetSuccess(response));
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Budget updated successfully',
        life: 3000,
      });
      setIsFormVisible(false);
      dispatch(setSelectedBudget(null));
      fetchBudgets();
    } catch (error) {
      dispatch(updateBudgetFailure(error.message));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      });
      throw error;
    }
  };

  const handleSubmitBudget = async (budgetData, budgetId) => {
    if (budgetId) {
      await handleUpdateBudget(budgetData, budgetId);
    } else {
      await handleCreateBudget(budgetData);
    }
  };

  const handleDeleteBudget = (budget) => {
    setBudgetToDelete(budget);
    setConfirmDialogVisible(true);
  };

  const acceptDeletion = async () => {
    if (!budgetToDelete) return;

    dispatch(deleteBudgetStart());
    try {
      await budgetService.deleteBudget(budgetToDelete.id);
      dispatch(deleteBudgetSuccess(budgetToDelete.id));
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Budget deleted successfully',
        life: 3000,
      });
      setConfirmDialogVisible(false);
      setBudgetToDelete(null);
      fetchBudgets();
    } catch (error) {
      dispatch(deleteBudgetFailure(error.message));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: error.message,
        life: 3000,
      });
    }
  };

  const rejectDeletion = () => {
    setConfirmDialogVisible(false);
    setBudgetToDelete(null);
  };

  const handleEditBudget = (budget) => {
    dispatch(setSelectedBudget(budget));
    setIsFormVisible(true);
  };

  const handleAddBudget = () => {
    dispatch(setSelectedBudget(null));
    setIsFormVisible(true);
  };

  const handlePageChange = (event) => {
    setFilters({
      ...filters,
      pageNumber: event.page + 1,
      pageSize: event.rows,
    });
  };

  const handleSort = (event) => {
    setFilters({
      ...filters,
      sortBy: event.sortField || 'CreatedAt',
      sortOrder: event.sortOrder === 1 ? 'asc' : 'desc',
    });
  };

  return (
    <div className={`${styles.pageContainer} surface-ground min-h-screen`}>
    <div className="p-4">
      <Toast ref={toast} />
      
      <div className="flex justify-content-between align-items-center mb-4">
        <h1 className="text-3xl font-bold m-0">Budget Management</h1>
        <Button
          label="Add Budget"
          icon="pi pi-plus"
          onClick={handleAddBudget}
        />
      </div>

      <BudgetTable
        budgets={budgets}
        totalCount={totalCount}
        pageSize={filters.pageSize}
        currentPage={filters.pageNumber - 1}
        onPageChange={handlePageChange}
        handleSort={handleSort}
        sortBy={filters.sortBy}
        sortOrder={filters.sortOrder === 'asc' ? 1 : -1}
        isLoading={loading}
        handleDeleteBudget={handleDeleteBudget}
        confirmDialogVisible={confirmDialogVisible}
        deletedBudgetName={budgetToDelete?.categoryName}
        acceptDeletion={acceptDeletion}
        rejectDeletion={rejectDeletion}
        handleEditBudget={handleEditBudget}
      />

      <BudgetForm
        isVisible={isFormVisible}
        setIsVisible={setIsFormVisible}
        selectedBudget={selectedBudget}
        setSelectedBudget={(budget) => dispatch(setSelectedBudget(budget))}
        onSubmit={handleSubmitBudget}
        isLoading={loading}
      />
    </div>
    </div>
  );
};

export default BudgetsPage;