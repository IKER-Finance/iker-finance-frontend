'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PAGE_ROUTES from '../../constants/page-constants';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(PAGE_ROUTES.overview);
  }, [router]);

  return (
    <div className="flex align-items-center justify-content-center min-h-screen">
      <div className="text-center">
        <i className="pi pi-spin pi-spinner text-4xl text-primary"></i>
        <p className="text-lg text-600 mt-3">Loading dashboard...</p>
      </div>
    </div>
  );
}