import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App.jsx';
import { AuthProvider } from './auth/useAuthStore';
import './index.css';

// Client ID diambil dari .env
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Provider Google Auth */}
    <GoogleOAuthProvider clientId={googleClientId}>
      {/* 2. Provider Auth Internal (Store) */}
      <AuthProvider>
        {/* 3. Router */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);