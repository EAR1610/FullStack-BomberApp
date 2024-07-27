import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/style.css';
import { PrimeReactProvider } from 'primereact/api';
import './css/satoshi.css';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { AuthContextProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <PrimeReactProvider>
    <React.StrictMode>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
    </React.StrictMode>,
  </PrimeReactProvider>
);
