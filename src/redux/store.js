import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth-slice';
import transactionReducer from './feature/transaction-slice';
import budgetReducer from './feature/budget-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuthFromStorage'],
      },
    }),
});

export default store;