import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // You might need to install this: npm install jwt-decode

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to stay logged in on refresh
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Decode token to get user info if you need it
            // const decoded = jwtDecode(token);
            return { token: token, user: null, role: null }; // Add user/role later
        }
        return null;
    });

    const login = (token, role) => {
        localStorage.setItem('token', token);
        // You can also save the role in localStorage
        localStorage.setItem('role', role); 
        setAuth({ token, role });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setAuth(null);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;