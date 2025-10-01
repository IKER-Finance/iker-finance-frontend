'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Dropdown } from 'primereact/dropdown';
import { authService, currencyService, tokenService } from '../../services';

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
  const [loading, setLoading] = useState(false);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);
  const router = useRouter();

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
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (!formData.homeCurrencyId) {
      setError('Please select your home currency');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register(formData);
      tokenService.setToken(response.token);
      tokenService.setUser(response.user);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currencyOptionTemplate = (option) => {
    return (
      <div>
        <span className="font-semibold">{option.code}</span> - {option.name} ({option.symbol})
      </div>
    );
  };

  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen"
      style={{
        backgroundImage: "url('https://www.idfcfirstbank.com/content/dam/idfcfirstbank/images/blog/finance/difference-between-money-finance-funds-717X404.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Card
        title="Register for IKER Finance"
        className="shadow-4"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '400px',  
          margin: '0 auto',    
        }}
      >
        {error && <Message severity="error" text={error} className="mb-3" />}

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
          <Link href="/login" className="text-primary font-medium">
            Login here
          </Link>
        </p>
      </Card>
    </div>
  );
}