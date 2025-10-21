export const formatCurrency = (amount, currencyCode = 'SEK', locale = 'sv-SE') => {
  if (amount === null || amount === undefined) return '-';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `${amount} ${currencyCode}`;
  }
};

export const formatCurrencyWithSymbol = (amount, symbol = 'kr') => {
  if (amount === null || amount === undefined) return '-';

  const formatted = new Intl.NumberFormat('sv-SE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${formatted} ${symbol}`;
};

export const getCurrencySymbol = (currencyCode, locale = 'sv-SE') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol'
    })
      .formatToParts(1)
      .find(part => part.type === 'currency')?.value || currencyCode;
  } catch (error) {
    return currencyCode;
  }
};

export const formatCompactCurrency = (amount, currencyCode = 'SEK', locale = 'sv-SE') => {
  if (amount === null || amount === undefined) return '-';

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);
  } catch (error) {
    return formatCurrency(amount, currencyCode, locale);
  }
};
