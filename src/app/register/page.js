'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { authService, currencyService } from '../../services';
import { selectAuthLoading, selectAuthError } from '../../redux/feature/auth-slice';
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
  const router = useRouter();

  const loading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
    } catch (err) {
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
          backgroundImage: "url('https://png.pngtree.com/thumb_back/fh260/background/20250512/pngtree-blue-gradient-soft-background-vector-image_17280771.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          padding: '1rem',
        }}
      >

        <div className="text-white w-full md:w-6 mb-4 md:mb-0 md:pr-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">Join IKER Finance</h1>
          <p className="text-base md:text-lg opacity-90">
            Take control of your money across multiple currencies. Whether you&apos;re studying abroad, traveling internationally, or managing finances in different countries, IKER Finance helps you track expenses, set smart budgets, and understand your spending habits while automatically converting everything to your home currency.
          </p>
          <p className="text-base md:text-lg opacity-90 mt-3">
            Create your free account in seconds and start managing your finances with confidence.
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
