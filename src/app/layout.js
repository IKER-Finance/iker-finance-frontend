'use client';

import { Provider } from 'react-redux';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import store from '../redux/store';
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
        <Provider store={store}>
          <PrimeReactProvider value={primeReactConfig}>
            <LayoutProvider>
              <RequireAuth>
                {children}
              </RequireAuth>
            </LayoutProvider>
          </PrimeReactProvider>
        </Provider>
      </body>
    </html>
  );
}