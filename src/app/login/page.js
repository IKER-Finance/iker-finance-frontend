'use client';

import Preloader from '../../components/Preloader';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { authService } from '../../services';
import { selectAuthLoading, selectAuthError } from '../../redux/feature/auth-slice';
import PAGE_ROUTES from '../../constants/page-constants';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPreloader, setShowPreloader] = useState(true);

  const router = useRouter();
  const dispatch = useDispatch();

  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.login(formData);
      router.push(PAGE_ROUTES.overview);
    } catch (err) {
    }
  };

  return (
    <>
      <Preloader visible={showPreloader} />

      <style jsx>{`
        @media (min-width: 768px) {
          .login-container {
            padding: 2rem !important;
          }
        }
        @media (min-width: 1024px) {
          .login-container {
            padding: 5rem !important;
          }
        }
      `}</style>

      <div
        className="login-container flex flex-column md:flex-row justify-content-between align-items-center min-h-screen"
        style={{
          backgroundImage:
            "url('https://png.pngtree.com/thumb_back/fh260/background/20250512/pngtree-blue-gradient-soft-background-vector-image_17280771.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          padding: '1rem',
        }}
      >
        <div className="text-white w-full md:w-6 mb-4 md:mb-0 md:pr-6 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 drop-shadow-lg">IKER Finance</h1>
          <p className="text-base md:text-lg opacity-90">
            Manage your finances across borders with confidence. Access your multi-currency expense tracker to view your spending patterns, check your budgets, and stay on top of your financial goals, all in your preferred currency.
          </p>
        </div>

        <div className="w-full md:w-6 flex justify-content-center">
          <Card
            title="Login to IKER Finance"
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
            {error && <Message severity="error" text={error} className="mb-3" />}

            <form onSubmit={handleSubmit} className="p-fluid">
              <div className="field mb-3">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field mb-4">
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

              <Button
                type="submit"
                label={loading ? 'Logging in...' : 'Login'}
                icon="pi pi-sign-in"
                loading={loading}
                className="w-full"
              />
            </form>

            <p className="text-center mt-4">
              Don&apos;t have an account?{' '}
              <Link href={PAGE_ROUTES.register} className="text-primary font-medium">
                Register here
              </Link>
            </p>
          </Card>
        </div>
      </div>
    </>
  );
}
