'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// PrimeReact imports
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';

import { authService, tokenService } from '../../services';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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

    try {
      const response = await authService.register(formData);
      tokenService.setToken(response.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center min-h-screen"
         style={{
           backgroundImage: "url('https://www.idfcfirstbank.com/content/dam/idfcfirstbank/images/blog/finance/difference-between-money-finance-funds-717X404.jpg')",
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat',
           minHeight: '100vh',
         }}
    >
      <Card title="Register for IKER Finance" className="w-full md:w-4 lg:w-3 shadow-4" style={{
      background: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(8px)',
      borderRadius: '1rem',
      width: '100%',
      maxWidth: '400px',  
      margin: '0 auto',    
    }}>
        
        {error && (
          <Message severity="error" text={error} className="mb-3" />
        )}

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
