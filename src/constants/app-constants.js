export const DEFAULT_LOCALE = 'sv-SE';
export const DEFAULT_CURRENCY = 'SEK';

export const DEFAULT_CURRENCY_FORMAT = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export const DEFAULT_DATE_FORMAT = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  DEFAULT_PAGE_NUMBER: 1,
};

export const COLORS = {
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  ON_TRACK: '#10B981',
  WARNING_THRESHOLD: '#F59E0B',
  OVER_BUDGET: '#EF4444',
  TEXT_PRIMARY: '#1e293b',
  TEXT_SECONDARY: '#64748b',
  TEXT_MUTED: '#94a3b8',
  BG_GRAY_100: '#f1f5f9',
  BG_GRAY_200: '#e2e8f0',
};

export const BUDGET_THRESHOLDS = {
  WARNING: 80,
  CRITICAL: 100,
};

export const API = {
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth-token',
  USER_DATA: 'user-data',
  THEME: 'theme',
  LANGUAGE: 'language',
};
