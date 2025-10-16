'use client';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Message } from 'primereact/message';
import { userService } from '@/services/api/user-service';
import { currencyService } from '@/services/api/currency-service';
import {
  getSettingsStart,
  getSettingsSuccess,
  getSettingsFailure,
  updateSettingsStart,
  updateSettingsSuccess,
  updateSettingsFailure,
  selectSettings,
  selectProfileLoading,
  selectProfileError,
  clearError,
} from '@/redux/feature/profile-slice';

// Common timezones
const TIMEZONES = [
  { label: 'America/New_York (Eastern Time)', value: 'America/New_York' },
  { label: 'America/Chicago (Central Time)', value: 'America/Chicago' },
  { label: 'America/Denver (Mountain Time)', value: 'America/Denver' },
  { label: 'America/Los_Angeles (Pacific Time)', value: 'America/Los_Angeles' },
  { label: 'America/Anchorage (Alaska Time)', value: 'America/Anchorage' },
  { label: 'Pacific/Honolulu (Hawaii Time)', value: 'Pacific/Honolulu' },
  { label: 'Europe/London (GMT/BST)', value: 'Europe/London' },
  { label: 'Europe/Paris (CET/CEST)', value: 'Europe/Paris' },
  { label: 'Europe/Berlin (CET/CEST)', value: 'Europe/Berlin' },
  { label: 'Europe/Stockholm (CET/CEST)', value: 'Europe/Stockholm' },
  { label: 'Europe/Madrid (CET/CEST)', value: 'Europe/Madrid' },
  { label: 'Europe/Rome (CET/CEST)', value: 'Europe/Rome' },
  { label: 'Europe/Athens (EET/EEST)', value: 'Europe/Athens' },
  { label: 'Europe/Moscow (MSK)', value: 'Europe/Moscow' },
  { label: 'Asia/Dubai (Gulf Time)', value: 'Asia/Dubai' },
  { label: 'Asia/Kolkata (India Time)', value: 'Asia/Kolkata' },
  { label: 'Asia/Bangkok (Indochina Time)', value: 'Asia/Bangkok' },
  { label: 'Asia/Singapore (Singapore Time)', value: 'Asia/Singapore' },
  { label: 'Asia/Hong_Kong (Hong Kong Time)', value: 'Asia/Hong_Kong' },
  { label: 'Asia/Shanghai (China Time)', value: 'Asia/Shanghai' },
  { label: 'Asia/Tokyo (Japan Time)', value: 'Asia/Tokyo' },
  { label: 'Asia/Seoul (Korea Time)', value: 'Asia/Seoul' },
  { label: 'Australia/Sydney (AEST/AEDT)', value: 'Australia/Sydney' },
  { label: 'Australia/Melbourne (AEST/AEDT)', value: 'Australia/Melbourne' },
  { label: 'Australia/Brisbane (AEST)', value: 'Australia/Brisbane' },
  { label: 'Australia/Perth (AWST)', value: 'Australia/Perth' },
  { label: 'Pacific/Auckland (NZST/NZDT)', value: 'Pacific/Auckland' },
  { label: 'UTC', value: 'UTC' },
];

export default function SettingsPage() {
  const dispatch = useDispatch();
  const toast = useRef(null);

  const settings = useSelector(selectSettings);
  const loading = useSelector(selectProfileLoading);
  const error = useSelector(selectProfileError);

  const [currencies, setCurrencies] = useState([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(false);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    defaultTransactionCurrencyId: null,
    timeZone: 'UTC',
  });

  // Display data
  const [homeCurrency, setHomeCurrency] = useState(null);

  // Validation errors
  const [settingsErrors, setSettingsErrors] = useState({});

  // Load settings and currencies on mount
  useEffect(() => {
    loadSettings();
    loadCurrencies();
  }, []);

  // Update form when settings load
  useEffect(() => {
    if (settings) {
      setSettingsForm({
        defaultTransactionCurrencyId: settings.defaultTransactionCurrencyId || null,
        timeZone: settings.timeZone || 'UTC',
      });
    }
  }, [settings]);

  const loadSettings = async () => {
    try {
      dispatch(getSettingsStart());
      const data = await userService.getSettings();
      dispatch(getSettingsSuccess(data));

      // Get home currency details if available
      if (data.homeCurrencyId) {
        await loadHomeCurrency(data.homeCurrencyId);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || 'Failed to load settings';
      dispatch(getSettingsFailure(errorMessage));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: errorMessage,
        life: 3000,
      });
    }
  };

  const loadCurrencies = async () => {
    try {
      setCurrenciesLoading(true);
      const data = await currencyService.getActiveCurrencies();
      // Filter only active currencies
      const activeCurrencies = data.filter((currency) => currency.isActive);
      setCurrencies(activeCurrencies);
    } catch (err) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to load currencies',
        life: 3000,
      });
    } finally {
      setCurrenciesLoading(false);
    }
  };

  const loadHomeCurrency = async (homeCurrencyId) => {
    try {
      const data = await currencyService.getActiveCurrencies();
      const currency = data.find((c) => c.id === homeCurrencyId);
      setHomeCurrency(currency);
    } catch (err) {
      console.error('Failed to load home currency:', err);
    }
  };

  const validateSettingsForm = () => {
    const errors = {};

    if (!settingsForm.timeZone || settingsForm.timeZone.trim() === '') {
      errors.timeZone = 'Timezone is required';
    } else if (settingsForm.timeZone.length > 50) {
      errors.timeZone = 'Timezone cannot exceed 50 characters';
    }

    if (
      settingsForm.defaultTransactionCurrencyId !== null &&
      settingsForm.defaultTransactionCurrencyId <= 0
    ) {
      errors.defaultTransactionCurrencyId =
        'Please select a valid currency';
    }

    setSettingsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();

    if (!validateSettingsForm()) {
      return;
    }

    try {
      dispatch(updateSettingsStart());
      const data = await userService.updateSettings({
        defaultTransactionCurrencyId:
          settingsForm.defaultTransactionCurrencyId,
        timeZone: settingsForm.timeZone,
      });
      dispatch(updateSettingsSuccess(data));

      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: 'Settings updated successfully',
        life: 3000,
      });
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors ||
        'Failed to update settings';
      dispatch(updateSettingsFailure(errorMessage));
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail:
          typeof errorMessage === 'string'
            ? errorMessage
            : 'Failed to update settings',
        life: 3000,
      });
    }
  };

  const handleInputChange = (field, value) => {
    setSettingsForm((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (settingsErrors[field]) {
      setSettingsErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const getCurrencyLabel = (currency) => {
    return `${currency.code} - ${currency.name} (${currency.symbol})`;
  };

  const getSelectedCurrency = () => {
    if (!settingsForm.defaultTransactionCurrencyId) return null;
    return currencies.find(
      (c) => c.id === settingsForm.defaultTransactionCurrencyId
    );
  };

  return (
    <div className="p-4">
      <Toast ref={toast} />

      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your application preferences and currency settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Currency Settings Card */}
        <Card title="Currency Settings" className="shadow-md">
          {loading && !settings ? (
            <div className="text-center py-4">
              <i className="pi pi-spin pi-spinner text-4xl text-blue-500"></i>
            </div>
          ) : (
            <form onSubmit={handleSettingsSubmit}>
              <div className="space-y-4">
                <Message
                  severity="info"
                  text="Your home currency is set during registration and cannot be changed as all budgets and transactions are tied to it."
                  className="mb-4"
                />

                {/* Home Currency (Read-only) */}
                <div className="field">
                  <label htmlFor="homeCurrency" className="block font-medium mb-2">
                    Home Currency{' '}
                    <span className="text-gray-500 text-sm">(Read-only)</span>
                  </label>
                  {homeCurrency ? (
                    <InputText
                      id="homeCurrency"
                      value={getCurrencyLabel(homeCurrency)}
                      disabled
                      className="w-full"
                    />
                  ) : (
                    <InputText
                      id="homeCurrency"
                      value="Loading..."
                      disabled
                      className="w-full"
                    />
                  )}
                  <small className="text-gray-500">
                    This is your primary currency for budgets and reports
                  </small>
                </div>

                {/* Default Transaction Currency */}
                <div className="field">
                  <label
                    htmlFor="defaultTransactionCurrency"
                    className="block font-medium mb-2"
                  >
                    Default Transaction Currency
                  </label>
                  <Dropdown
                    id="defaultTransactionCurrency"
                    value={settingsForm.defaultTransactionCurrencyId}
                    options={currencies}
                    onChange={(e) =>
                      handleInputChange('defaultTransactionCurrencyId', e.value)
                    }
                    optionLabel={(option) => getCurrencyLabel(option)}
                    optionValue="id"
                    placeholder="Select a currency"
                    className={`w-full ${settingsErrors.defaultTransactionCurrencyId ? 'p-invalid' : ''}`}
                    filter
                    showClear
                    loading={currenciesLoading}
                    disabled={currenciesLoading}
                  />
                  {settingsErrors.defaultTransactionCurrencyId && (
                    <small className="text-red-500">
                      {settingsErrors.defaultTransactionCurrencyId}
                    </small>
                  )}
                  <small className="text-gray-500">
                    This currency will be pre-selected when creating transactions
                  </small>
                </div>

                {/* Timezone */}
                <div className="field">
                  <label htmlFor="timezone" className="block font-medium mb-2">
                    Timezone <span className="text-red-500">*</span>
                  </label>
                  <Dropdown
                    id="timezone"
                    value={settingsForm.timeZone}
                    options={TIMEZONES}
                    onChange={(e) => handleInputChange('timeZone', e.value)}
                    placeholder="Select a timezone"
                    className={`w-full ${settingsErrors.timeZone ? 'p-invalid' : ''}`}
                    filter
                  />
                  {settingsErrors.timeZone && (
                    <small className="text-red-500">
                      {settingsErrors.timeZone}
                    </small>
                  )}
                  <small className="text-gray-500">
                    Used for displaying dates and times throughout the application
                  </small>
                </div>

                <Button
                  type="submit"
                  label="Save Settings"
                  icon="pi pi-check"
                  className="w-full"
                  loading={loading}
                  disabled={loading || currenciesLoading}
                />
              </div>
            </form>
          )}
        </Card>

        {/* Information Card */}
        <Card title="About Currency Settings" className="shadow-md">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <i className="pi pi-info-circle mr-2 text-blue-500"></i>
                Home Currency
              </h3>
              <p className="text-gray-700 mb-2">
                Your home currency is the primary currency for your financial
                management. It is used for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>All budget calculations and limits</li>
                <li>Financial reports and analytics</li>
                <li>Total balance calculations</li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>Note:</strong> This currency cannot be changed after
                registration to maintain data integrity.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <i className="pi pi-money-bill mr-2 text-green-500"></i>
                Default Transaction Currency
              </h3>
              <p className="text-gray-700 mb-2">
                The default transaction currency is pre-selected when you create
                a new transaction, saving you time. You can change it to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Match your most frequently used currency</li>
                <li>Reflect the currency of your current location</li>
                <li>Any active currency in the system</li>
              </ul>
              <p className="text-gray-700 mt-2">
                <strong>Note:</strong> You can still select any currency when
                creating individual transactions.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center">
                <i className="pi pi-clock mr-2 text-purple-500"></i>
                Timezone
              </h3>
              <p className="text-gray-700">
                Your timezone setting ensures that all dates and times are
                displayed correctly according to your local time. This affects
                transaction timestamps, budget periods, and report generation.
              </p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
              <div className="flex items-start">
                <i className="pi pi-exclamation-triangle text-yellow-700 mr-2 mt-1"></i>
                <div>
                  <p className="text-sm text-yellow-700">
                    <strong>Important:</strong> Changing your timezone may affect
                    how existing transaction dates are displayed. The actual
                    transaction data remains unchanged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
