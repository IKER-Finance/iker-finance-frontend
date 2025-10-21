import { useState, useEffect } from 'react';
import { currencyService, categoryService } from '@/services';

export const useFormData = (isVisible) => {
  const [currencies, setCurrencies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isVisible) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [currenciesData, categoriesData] = await Promise.all([
          currencyService.getActiveCurrencies(),
          categoryService.getCategories(),
        ]);

        setCurrencies(currenciesData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err.message || 'Failed to load form data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isVisible]);

  return {
    currencies,
    categories,
    loading,
    error,
  };
};
