import { configureStore } from '@reduxjs/toolkit';
import authReducer from './feature/auth-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/setAuthFromStorage'],
      },
    }),
});

export default store;