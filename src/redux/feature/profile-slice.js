import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  settings: null,
  loading: false,
  error: null,
  passwordChangeLoading: false,
  passwordChangeError: null,
  passwordChangeSuccess: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    // Get Profile
    getProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    getProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Profile
    updateProfileStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action) => {
      state.loading = false;
      state.profile = action.payload;
      state.error = null;
    },
    updateProfileFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Change Password
    changePasswordStart: (state) => {
      state.passwordChangeLoading = true;
      state.passwordChangeError = null;
      state.passwordChangeSuccess = false;
    },
    changePasswordSuccess: (state) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
      state.passwordChangeSuccess = true;
    },
    changePasswordFailure: (state, action) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = action.payload;
      state.passwordChangeSuccess = false;
    },
    resetPasswordChangeState: (state) => {
      state.passwordChangeLoading = false;
      state.passwordChangeError = null;
      state.passwordChangeSuccess = false;
    },

    // Get Settings
    getSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    getSettingsSuccess: (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.error = null;
    },
    getSettingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update Settings
    updateSettingsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSettingsSuccess: (state, action) => {
      state.loading = false;
      state.settings = action.payload;
      state.error = null;
    },
    updateSettingsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.passwordChangeError = null;
    },
  },
});

export const {
  getProfileStart,
  getProfileSuccess,
  getProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  changePasswordStart,
  changePasswordSuccess,
  changePasswordFailure,
  resetPasswordChangeState,
  getSettingsStart,
  getSettingsSuccess,
  getSettingsFailure,
  updateSettingsStart,
  updateSettingsSuccess,
  updateSettingsFailure,
  clearError,
} = profileSlice.actions;

// Selectors
export const selectProfile = (state) => state.profile.profile;
export const selectSettings = (state) => state.profile.settings;
export const selectProfileLoading = (state) => state.profile.loading;
export const selectProfileError = (state) => state.profile.error;
export const selectPasswordChangeLoading = (state) =>
  state.profile.passwordChangeLoading;
export const selectPasswordChangeError = (state) =>
  state.profile.passwordChangeError;
export const selectPasswordChangeSuccess = (state) =>
  state.profile.passwordChangeSuccess;

export default profileSlice.reducer;
