import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [],
  summary: null,
  selectedTransaction: null,
  totalCount: 0,
  pageNumber: 1,
  pageSize: 10,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    fetchTransactionsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchTransactionsSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload.data;
      state.totalCount = action.payload.totalCount;
      state.pageNumber = action.payload.pageNumber;
      state.pageSize = action.payload.pageSize;
      state.error = null;
    },
    fetchTransactionsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSummaryStart: (state) => {
      state.error = null;
    },
    fetchSummarySuccess: (state, action) => {
      state.summary = action.payload;
      state.error = null;
    },
    fetchSummaryFailure: (state, action) => {
      state.error = action.payload;
    },
    createTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createTransactionSuccess: (state, action) => {
      state.loading = false;
      state.transactions = [action.payload, ...state.transactions];
      state.error = null;
    },
    createTransactionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateTransactionSuccess: (state, action) => {
      state.loading = false;
      const index = state.transactions.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.transactions[index] = action.payload;
      }
      state.error = null;
    },
    updateTransactionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTransactionStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteTransactionSuccess: (state, action) => {
      state.loading = false;
      state.transactions = state.transactions.filter(t => t.id !== action.payload);
      state.totalCount = state.totalCount - 1;
      state.error = null;
    },
    deleteTransactionFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedTransaction: (state, action) => {
      state.selectedTransaction = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchTransactionsStart,
  fetchTransactionsSuccess,
  fetchTransactionsFailure,
  fetchSummaryStart,
  fetchSummarySuccess,
  fetchSummaryFailure,
  createTransactionStart,
  createTransactionSuccess,
  createTransactionFailure,
  updateTransactionStart,
  updateTransactionSuccess,
  updateTransactionFailure,
  deleteTransactionStart,
  deleteTransactionSuccess,
  deleteTransactionFailure,
  setSelectedTransaction,
  clearError,
} = transactionSlice.actions;

export const selectTransactions = (state) => state.transaction.transactions;
export const selectTransactionLoading = (state) => state.transaction.loading;
export const selectTransactionError = (state) => state.transaction.error;
export const selectTransactionTotalCount = (state) => state.transaction.totalCount;
export const selectTransactionSummary = (state) => state.transaction.summary;
export const selectSelectedTransaction = (state) => state.transaction.selectedTransaction;

export default transactionSlice.reducer;