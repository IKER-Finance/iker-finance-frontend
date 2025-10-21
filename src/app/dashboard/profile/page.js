'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { userService } from '@/services/api/user-service';
import { tokenService } from '@/utils/token';
import {
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
  selectProfile,
  selectProfileLoading,
  selectProfileError,
  selectPasswordChangeLoading,
  selectPasswordChangeError,
  selectPasswordChangeSuccess,
  clearError,
} from '@/redux/feature/profile-slice';
import { loginSuccess } from '@/redux/feature/auth-slice';
import styles from '../overview-page.module.css'; 

export default function ProfilePage() {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const profile = useSelector(selectProfile);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);
  const passwordChangeLoading = useSelector(selectPasswordChangeLoading);
  const passwordChangeError = useSelector(selectPasswordChangeError);
  const passwordChangeSuccess = useSelector(selectPasswordChangeSuccess);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Validation errors
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
      });
    }
  }, [profile]);

  // Handle password change success
  useEffect(() => {
    if (passwordChangeSuccess) {
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Password changed successfully',
        life: 3000,
      });
      // Reset password form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setPasswordErrors({});
      dispatch(resetPasswordChangeState());
    }
  }, [passwordChangeSuccess]);

  // Handle password change error
  useEffect(() => {
    if (passwordChangeError) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: passwordChangeError,
        life: 3000,
      });
    }
  }, [passwordChangeError]);

  const loadProfile = async () => {
    try {
      dispatch(getProfileStart());
      const data = await userService.getProfile();
      dispatch(getProfileSuccess(data));
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to load profile';
      dispatch(getProfileFailure(errorMessage));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  const validateProfileForm = () => {
    const errors = {};

    if (!profileForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (profileForm.firstName.length > 50) {
      errors.firstName = 'First name cannot exceed 50 characters';
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (profileForm.lastName.length > 50) {
      errors.lastName = 'Last name cannot exceed 50 characters';
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePasswordForm = () => {
    const errors = {};

    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordForm.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    } else {
      // Check password requirements
      const hasUppercase = /[A-Z]/.test(passwordForm.newPassword);
      const hasLowercase = /[a-z]/.test(passwordForm.newPassword);
      const hasDigit = /[0-9]/.test(passwordForm.newPassword);
      const hasSpecial = /[!@#$%^&*]/.test(passwordForm.newPassword);

      if (!hasUppercase) {
        errors.newPassword = 'Password must contain at least one uppercase letter';
      } else if (!hasLowercase) {
        errors.newPassword = 'Password must contain at least one lowercase letter';
      } else if (!hasDigit) {
        errors.newPassword = 'Password must contain at least one digit';
      } else if (!hasSpecial) {
        errors.newPassword = 'Password must contain at least one special character (!@#$%^&*)';
      }
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      dispatch(updateProfileStart());
      const data = await userService.updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
      });
      dispatch(updateProfileSuccess(data));

      // Update local storage and Redux auth state
      const currentUser = tokenService.getUser();
      const updatedUser = {
        ...currentUser,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      tokenService.setUser(updatedUser);

      // Update auth state to reflect changes in topbar
      const token = tokenService.getToken();
      dispatch(loginSuccess({ user: updatedUser, token }));

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Profile updated successfully',
        life: 3000,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        'Failed to update profile';
      dispatch(updateProfileFailure(errorMessage));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: typeof errorMessage === 'string' ? errorMessage : 'Failed to update profile',
        life: 3000,
      });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    try {
      dispatch(changePasswordStart());
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      dispatch(changePasswordSuccess());
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        'Failed to change password';
      dispatch(changePasswordFailure(
        typeof errorMessage === 'string' ? errorMessage : 'Failed to change password'
      ));
    }
  };

  const handleProfileInputChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (profileErrors[field]) {
      setProfileErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePasswordInputChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (passwordErrors[field]) {
      setPasswordErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const passwordHeader = (
    <div className="mb-3">
      <strong>Password Requirements:</strong>
      <ul className="mt-2 mb-0 pl-4">
        <li>At least 6 characters</li>
        <li>One uppercase letter (A-Z)</li>
        <li>One lowercase letter (a-z)</li>
        <li>One digit (0-9)</li>
        <li>One special character (!@#$%^&*)</li>
      </ul>
    </div>
  );

  return (
   <div className={styles.pageContainer}>

      <Toast ref={toast} />

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Profile</h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information and security settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 justify-center items-start">
        {/* Profile Information Card */}
        <Card title="Profile Information" className="shadow-md mx-auto max-w-md w-full">
          {loading && !profile ? (
            <div className="text-center py-4">
              <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit}>
              <div className="space-y-4">
                {/* Email (Read-only) */}
                <div className="field">
                  <label htmlFor="email" className="block font-medium mb-2">
                    Email <span className="text-gray-500 text-sm">(Read-only)</span>
                  </label>
                  <InputText
                    id="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full"
                  />
                </div>

                {/* First Name */}
                <div className="field">
                  <label htmlFor="firstName" className="block font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="firstName"
                    value={profileForm.firstName}
                    onChange={(e) =>
                      handleProfileInputChange('firstName', e.target.value)
                    }
                    className={`w-full ${profileErrors.firstName ? 'p-invalid' : ''}`}
                    maxLength={50}
                  />
                  {profileErrors.firstName && (
                    <small className="text-red-500">
                      {profileErrors.firstName}
                    </small>
                  )}
                </div>

                {/* Last Name */}
                <div className="field">
                  <label htmlFor="lastName" className="block font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <InputText
                    id="lastName"
                    value={profileForm.lastName}
                    onChange={(e) =>
                      handleProfileInputChange('lastName', e.target.value)
                    }
                    className={`w-full ${profileErrors.lastName ? 'p-invalid' : ''}`}
                    maxLength={50}
                  />
                  {profileErrors.lastName && (
                    <small className="text-red-500">
                      {profileErrors.lastName}
                    </small>
                  )}
                </div>

                {/* Home Currency (Read-only) */}
                <div className="field">
                  <label htmlFor="homeCurrency" className="block font-medium mb-2">
                    Home Currency <span className="text-gray-500 text-sm">(Read-only)</span>
                  </label>
                  <InputText
                    id="homeCurrency"
                    value={profile?.homeCurrencyCode || 'Not set'}
                    disabled
                    className="w-full"
                  />
                </div>

                {/* Registration Date (Read-only) */}
                <div className="field">
                  <label htmlFor="registrationDate" className="block font-medium mb-2">
                    Registration Date
                  </label>
                  <InputText
                    id="registrationDate"
                    value={formatDate(profile?.registrationDate)}
                    disabled
                    className="w-full"
                  />
                </div>

                {/* Last Login (Read-only) */}
                <div className="field">
                  <label htmlFor="lastLogin" className="block font-medium mb-2">
                    Last Login
                  </label>
                  <InputText
                    id="lastLogin"
                    value={formatDate(profile?.lastLoginDate)}
                    disabled
                    className="w-full"
                  />
                </div>

                <Button
                  type="submit"
                  label="Save Changes"
                  icon="pi pi-check"
                  className="w-full"
                  loading={loading}
                  disabled={loading}
                />
              </div>
            </form>
          )}
        </Card>

        {/* Change Password Card */}
        <Card title="Change Password" className="shadow-md">
          <form onSubmit={handlePasswordSubmit}>
            <div className="space-y-4">
              <Message
                severity="info"
                text="Password must be at least 6 characters and contain uppercase, lowercase, digit, and special character."
                className="mb-4"
              />

              {/* Current Password */}
              <div className="field">
                <label htmlFor="currentPassword" className="block font-medium mb-2">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <Password
                  id="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    handlePasswordInputChange('currentPassword', e.target.value)
                  }
                  className={`w-full ${passwordErrors.currentPassword ? 'p-invalid' : ''}`}
                  inputClassName="w-full"
                  toggleMask
                  feedback={false}
                />
                {passwordErrors.currentPassword && (
                  <small className="text-red-500">
                    {passwordErrors.currentPassword}
                  </small>
                )}
              </div>

              {/* New Password */}
              <div className="field">
                <label htmlFor="newPassword" className="block font-medium mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <Password
                  id="newPassword"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    handlePasswordInputChange('newPassword', e.target.value)
                  }
                  className={`w-full ${passwordErrors.newPassword ? 'p-invalid' : ''}`}
                  inputClassName="w-full"
                  toggleMask
                  header={passwordHeader}
                />
                {passwordErrors.newPassword && (
                  <small className="text-red-500">
                    {passwordErrors.newPassword}
                  </small>
                )}
              </div>

              {/* Confirm New Password */}
              <div className="field">
                <label htmlFor="confirmPassword" className="block font-medium mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <Password
                  id="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    handlePasswordInputChange('confirmPassword', e.target.value)
                  }
                  className={`w-full ${passwordErrors.confirmPassword ? 'p-invalid' : ''}`}
                  inputClassName="w-full"
                  toggleMask
                  feedback={false}
                />
                {passwordErrors.confirmPassword && (
                  <small className="text-red-500">
                    {passwordErrors.confirmPassword}
                  </small>
                )}
              </div>

              <Button
                type="submit"
                label="Change Password"
                icon="pi pi-lock"
                className="w-full"
                loading={passwordChangeLoading}
                disabled={passwordChangeLoading}
                severity="warning"
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
