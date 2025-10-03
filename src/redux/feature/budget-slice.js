import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  budgets: [],
  selectedBudget: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: 'budget',
  initialState,
  reducers: {
    fetchBudgetsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchBudgetsSuccess: (state, action) => {
      state.loading = false;
      state.budgets = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.pageNumber = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.error = null;
    },
    fetchBudgetsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createBudgetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createBudgetSuccess: (state, action) => {
      state.loading = false;
      state.budgets = [action.payload, ...state.budgets];
      state.error = null;
    },
    createBudgetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBudgetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateBudgetSuccess: (state, action) => {
      state.loading = false;
      const index = state.budgets.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.budgets[index] = action.payload;
      }
      state.error = null;
    },
    updateBudgetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBudgetStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteBudgetSuccess: (state, action) => {
      state.loading = false;
      state.budgets = state.budgets.filter(b => b.id !== action.payload);
      state.totalCount = state.totalCount - 1;
      state.error = null;
    },
    deleteBudgetFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedBudget: (state, action) => {
      state.selectedBudget = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
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
  clearError,
} = budgetSlice.actions;

export const selectBudgets = (state) => state.budget.budgets;
export const selectBudgetLoading = (state) => state.budget.loading;
export const selectBudgetError = (state) => state.budget.error;
export const selectBudgetTotalCount = (state) => state.budget.totalCount;
export const selectSelectedBudget = (state) => state.budget.selectedBudget;

export default budgetSlice.reducer;