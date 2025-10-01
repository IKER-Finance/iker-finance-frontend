'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { authService } from '../../services/api-service/auth-service';
import { selectAuthLoading, selectAuthError } from '../../redux/feature/auth-slice';
import PAGE_ROUTES from '../../constants/page-constants';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const router = useRouter();
  const dispatch = useDispatch();
  
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await authService.login(formData);
      router.push(PAGE_ROUTES.overview);
    } catch (err) {
      // Error is already handled by Redux in authService
    }
  };
  
  return (
    <div
      className="flex justify-content-center align-items-center min-h-screen"
      style={{
        backgroundImage: "url('https://cloudinary.hbs.edu/hbsit/image/upload/s--wx5D2ABw--/f_auto,c_fill,h_900,w_1600/v20200101/5393409F6FB391494111C5EC16653C89.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Card
        title="Login to IKER Finance"
        className="shadow-6"
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
  );
}