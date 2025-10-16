import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth-slice';
import transactionReducer from './feature/transaction-slice';
import budgetReducer from './feature/budget-slice';
import feedbackReducer from './feature/feedback-slice';
import profileReducer from './feature/profile-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transaction: transactionReducer,
    budget: budgetReducer,
    feedback: feedbackReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuthFromStorage'],
      },
    }),
});

export default store;