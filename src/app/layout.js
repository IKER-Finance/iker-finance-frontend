'use client';

import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import '../styles/theme.css';
import '../styles/dashboard.css';

import StoreProvider from '../redux/store-provider';
import { LayoutProvider } from '../layout/context/layout-context';
import RequireAuth from '../components/auth/require-auth';

export default function RootLayout({ children }) {
  const primeReactConfig = {
    ripple: true,
    inputStyle: 'outlined',
  };

  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <PrimeReactProvider value={primeReactConfig}>
            <LayoutProvider>
              <RequireAuth>
                {children}
              </RequireAuth>
            </LayoutProvider>
          </PrimeReactProvider>
        </StoreProvider>
      </body>
    </html>
  );
}