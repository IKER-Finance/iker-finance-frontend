const DEFAULT_LOCALE = 'sv-SE';

export const formatDate = (date, options = {}, locale = DEFAULT_LOCALE) => {
  if (!date) return '-';

  const defaults = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  try {
    return new Date(date).toLocaleDateString(locale, { ...defaults, ...options });
  } catch (error) {
    return String(date);
  }
};

export const formatDateShort = (date, locale = DEFAULT_LOCALE) => {
  return formatDate(date, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }, locale);
};

export const formatDateLong = (date, locale = DEFAULT_LOCALE) => {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }, locale);
};

export const formatDateRange = (startDate, endDate, locale = DEFAULT_LOCALE) => {
  if (!startDate || !endDate) return '-';
  return `${formatDate(startDate, {}, locale)} - ${formatDate(endDate, {}, locale)}`;
};

export const formatRelativeTime = (date, locale = DEFAULT_LOCALE) => {
  if (!date) return '-';

  try {
    const now = new Date();
    const then = new Date(date);
    const diffInSeconds = Math.floor((now - then) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (Math.abs(diffInSeconds) < 60) {
      return rtf.format(-diffInSeconds, 'second');
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (Math.abs(diffInMinutes) < 60) {
      return rtf.format(-diffInMinutes, 'minute');
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (Math.abs(diffInHours) < 24) {
      return rtf.format(-diffInHours, 'hour');
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (Math.abs(diffInDays) < 30) {
      return rtf.format(-diffInDays, 'day');
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (Math.abs(diffInMonths) < 12) {
      return rtf.format(-diffInMonths, 'month');
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return rtf.format(-diffInYears, 'year');
  } catch (error) {
    return formatDate(date, {}, locale);
  }
};

export const formatDateTime = (date, locale = DEFAULT_LOCALE) => {
  return formatDate(date, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }, locale);
};

export const getMonthName = (date, locale = DEFAULT_LOCALE) => {
  if (!date) return '';

  try {
    return new Date(date).toLocaleDateString(locale, { month: 'long' });
  } catch (error) {
    return '';
  }
};
