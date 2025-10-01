'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/feature/auth-slice';
import PAGE_ROUTES from '../constants/page-constants';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(PAGE_ROUTES.overview);
    } else {
      router.push(PAGE_ROUTES.login);
    }
  }, [isAuthenticated, router]);

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
        <p className="text-lg text-600 mt-3">Loading...</p>
      </div>
    </div>
  );
}