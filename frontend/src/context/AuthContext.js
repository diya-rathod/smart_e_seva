import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the context
const AuthContext = createContext();

// 2. Create the provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for token on initial load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to handle login
  const login = (newToken) => {
    localStorage.setItem('token', newToken); // Save token to local storage
    setToken(newToken); // Update state
    navigate('/registered/dashboard'); // Redirect to dashboard
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token'); // Remove token from local storage
    setToken(null); // Clear state
    navigate('/login'); // Redirect to login
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;