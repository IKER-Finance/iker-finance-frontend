import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  submitting: false,
  success: false,
  error: null,
  lastSubmittedFeedback: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    submitFeedbackStart: (state) => {
      state.submitting = true;
      state.success = false;
      state.error = null;
    },
    submitFeedbackSuccess: (state, action) => {
      state.submitting = false;
      state.success = true;
      state.lastSubmittedFeedback = action.payload;
      state.error = null;
    },
    submitFeedbackFailure: (state, action) => {
      state.submitting = false;
      state.success = false;
      state.error = action.payload;
    },
    resetFeedbackState: (state) => {
      state.submitting = false;
      state.success = false;
      state.error = null;
      state.lastSubmittedFeedback = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  submitFeedbackStart,
  submitFeedbackSuccess,
  submitFeedbackFailure,
  resetFeedbackState,
  clearError,
} = feedbackSlice.actions;

export const selectFeedbackSubmitting = (state) => state.feedback.submitting;
export const selectFeedbackSuccess = (state) => state.feedback.success;
export const selectFeedbackError = (state) => state.feedback.error;
export const selectLastSubmittedFeedback = (state) => state.feedback.lastSubmittedFeedback;

export default feedbackSlice.reducer;
