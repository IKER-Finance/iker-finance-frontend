'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tokenService } from '../../services';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!tokenService.isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    tokenService.removeToken();
    router.push('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>IKER Finance Dashboard</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
      <p>Welcome to your finance dashboard!</p>
      <p>More features coming soon...</p>
    </div>
  );
}