export const extractErrorMessage = (error, defaultMessage = 'An error occurred') => {
  return (
    error?.response?.data?.error ||
    error?.response?.data?.message ||
    error?.message ||
    defaultMessage
  );
};

export const handleApiError = (error, defaultMessage = 'An error occurred') => {
  const message = extractErrorMessage(error, defaultMessage);
  throw new Error(message);
};

export const isNetworkError = (error) => {
  return (
    !error?.response &&
    (error?.message === 'Network Error' || error?.code === 'ECONNABORTED')
  );
};

export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

export const isValidationError = (error) => {
  const status = error?.response?.status;
  return status === 400 || status === 422;
};

export const getValidationErrors = (error) => {
  if (!isValidationError(error)) return {};
  return error?.response?.data?.errors || {};
};
