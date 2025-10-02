import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth-slice';
import transactionReducer from './feature/transaction-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuthFromStorage'],
      },
    }),
});

export default store;