'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenService } from '../services';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (tokenService.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>Redirecting...</p>
    </div>
  );
}