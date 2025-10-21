'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import Preloader from '../components/preloader';
import { selectIsAuthenticated } from '../redux/feature/auth-slice';
import PAGE_ROUTES from '../constants/page-constants';

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push(PAGE_ROUTES.overview);
    } else {
      router.push(PAGE_ROUTES.login);
    }
  }, [isAuthenticated, router]);

  return <Preloader visible={showPreloader} />;
}