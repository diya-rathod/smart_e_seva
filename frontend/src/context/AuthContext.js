import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // On page load, try to get auth info from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        if (token && role) {
            return { token, role };
        }
        return null;
    });

    const login = (token, role) => {
        // Save token and role to localStorage and state
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        setAuth({ token, role });
    };

    const logout = () => {
        // Clear auth info from localStorage and state
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth(null);
        // Optional: redirect to login page
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;