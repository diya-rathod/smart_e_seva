// src/context/ThemeContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// 1. Context create karna
const ThemeContext = createContext();

// 2. Provider component banana
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme is light

  // Jab bhi theme change ho, <html> tag mein class add/remove karega
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Custom hook banana taaki use karna aasan ho
export const useTheme = () => {
  return useContext(ThemeContext);
};