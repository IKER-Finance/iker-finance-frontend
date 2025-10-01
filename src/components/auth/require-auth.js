'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { selectIsAuthenticated, selectAuthLoading } from '../../redux/feature/auth-slice';
import { authService } from '../../services/api-service/auth-service';
import PAGE_ROUTES from '../../constants/page-constants';

const RequireAuth = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authLoading = useSelector(selectAuthLoading);
  const [isInitialized, setIsInitialized] = useState(false);

  const publicRoutes = [PAGE_ROUTES.login, PAGE_ROUTES.register, PAGE_ROUTES.home];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    const initializeAuth = () => {
      try {
        authService.initializeAuth();
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        setIsInitialized(true);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (!isInitialized || authLoading) return;

    if (!isAuthenticated && !isPublicRoute) {
      router.push(PAGE_ROUTES.login);
    } else if (isAuthenticated && (pathname === PAGE_ROUTES.login || pathname === PAGE_ROUTES.register)) {
      router.push(PAGE_ROUTES.overview);
    } else if (isAuthenticated && pathname === PAGE_ROUTES.home) {
      router.push(PAGE_ROUTES.overview);
    }
  }, [isAuthenticated, isPublicRoute, pathname, router, isInitialized, authLoading]);

  if (!isInitialized || authLoading) {
    return (
      <div className="flex align-items-center justify-content-center min-h-screen">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
          <p className="text-lg text-600 mt-3">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  return children;
};

export default RequireAuth;