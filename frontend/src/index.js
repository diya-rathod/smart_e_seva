import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Ise import karein
import { AuthProvider } from './context/AuthContext';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* App ko isse wrap karein */}
      <AuthProvider> {/* App ko isse wrap karein */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);