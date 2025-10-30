'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import Preloader from '../../components/preloader';
import Logo from '../../components/common/logo';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { authService, currencyService } from '../../services';
import { selectAuthLoading, selectAuthError, clearError } from '../../redux/feature/auth-slice';
import PAGE_ROUTES from '../../constants/page-constants';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    homeCurrencyId: null,
  });
  const [currencies, setCurrencies] = useState([]);
  const [error, setError] = useState('');
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const [showPreloader, setShowPreloader] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const data = await currencyService.getActiveCurrencies();
        setCurrencies(data);
      } catch (err) {
        setError('Failed to load currencies. Please refresh the page.');
      } finally {
        setLoadingCurrencies(false);
      }
    };
    fetchCurrencies();
  }, []);

  const handleChange = (e) => {
    if (error) {
      setError('');
    }
    if (authError) {
      dispatch(clearError());
    }
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one digit (0-9)');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter (a-z)');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter (A-Z)');
    }

    const uniqueChars = new Set(password).size;
    if (uniqueChars < 1) {
      errors.push('Password must contain at least 1 unique character');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors.join('. '));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.homeCurrencyId) {
      setError('Please select your home currency');
      return;
    }

    try {
      await authService.register(formData);
      router.push(PAGE_ROUTES.overview);
    } catch {
    }
  };

  const currencyOptionTemplate = (option) => (
    <div>
      <span className="font-semibold">{option.code}</span> - {option.name} ({option.symbol})
    </div>
  );

  const displayError = error || authError;

  return (
    <>
      <Preloader visible={showPreloader} />

      <style jsx>{`
        @media (min-width: 768px) {
          .register-container {
            padding: 2rem !important;
          }
        }
        @media (min-width: 1024px) {
          .register-container {
            padding: 5rem !important;
          }
        }
      `}</style>

      <div
        className="register-container flex flex-column md:flex-row justify-content-between align-items-center min-h-screen"
        style={{
          background: 'linear-gradient(135deg, #0f2027 0%, #203a43 25%, #2c5364 50%, #3b82f6 75%, #60a5fa 100%)',
          minHeight: '100vh',
          padding: '1rem',
        }}
      >

        <div className="text-white w-full md:w-6 mb-4 md:mb-0 md:pr-6 text-center md:text-left">
          <div className="mb-3" style={{ filter: 'brightness(0) invert(1)' }}>
            <Logo size="hero" />
          </div>

          <div className="mb-4" style={{ borderRadius: '0.5rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <video
              className="w-full"
              controls
              style={{ maxHeight: '320px', objectFit: 'cover', display: 'block' }}
            >
              <source src="/videos/IKER Finance Intro.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="text-base md:text-lg opacity-90">
            Manage your finances across multiple currencies with ease. Track expenses, set budgets, and gain insights - all automatically converted to your home currency.
          </p>
        </div>


        <div className="w-full md:w-6 flex justify-content-center">
          <Card
            title="Register for IKER Finance"
            className="shadow-6"
            style={{
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(8px)',
              borderRadius: '1rem',
              width: '100%',
              maxWidth: '400px',
              padding: '1.5rem',
            }}
          >
          {displayError && <Message severity="error" text={displayError} className="mb-3" />}

          <form onSubmit={handleSubmit} className="p-fluid">
            <div className="field mb-3">
              <label htmlFor="firstName">First Name</label>
              <InputText
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field mb-3">
              <label htmlFor="lastName">Last Name</label>
              <InputText
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field mb-3">
              <label htmlFor="email">Email</label>
              <InputText
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="field mb-3">
              <label htmlFor="homeCurrencyId">Home Currency</label>
              <Dropdown
                id="homeCurrencyId"
                name="homeCurrencyId"
                value={formData.homeCurrencyId}
                options={currencies}
                onChange={(e) => setFormData({ ...formData, homeCurrencyId: e.value })}
                optionLabel="code"
                optionValue="id"
                placeholder="Select your currency"
                itemTemplate={currencyOptionTemplate}
                disabled={loadingCurrencies}
                required
              />
            </div>

            <div className="field mb-3">
              <label htmlFor="password">Password</label>
              <Password
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                feedback={false}
                toggleMask
                required
              />
              <small className="text-600 block mt-1">
                Password must be at least 8 characters and include: uppercase, lowercase, and a digit
              </small>
            </div>

            <div className="field mb-4">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <Password
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                feedback={false}
                toggleMask
                required
              />
            </div>

            <Button
              type="submit"
              label={loading ? 'Registering...' : 'Register'}
              icon="pi pi-user-plus"
              loading={loading}
              disabled={loadingCurrencies}
              className="w-full"
            />
          </form>

          <p className="text-center mt-4">
            Already have an account?{' '}
            <Link href={PAGE_ROUTES.login} className="text-primary font-medium">
              Login here
            </Link>
          </p>
        </Card>
      </div>
    </div>
    </>
  );
}
