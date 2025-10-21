// AuthContext.js

import React, { createContext, useState, useEffect } from 'react'; // <-- useEffect ko import karo
import { jwtDecode } from "jwt-decode";
import axios from 'axios'; // <-- NAYA IMPORT
import toast from 'react-hot-toast'; // <-- NAYA IMPORT

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        if (token && role && email) {
            return { token, role, email };
        }
        return null;
    });

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        const email = decodedToken.sub;
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        setAuth({ token, role, email });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        setAuth(null);
        window.location.href = '/login';
    };

    // --- YEH NAYA CODE ADD HUA HAI ---
    useEffect(() => {
        // Yeh hai Axios Interceptor (hamara gatekeeper)
        const interceptor = axios.interceptors.response.use(
            (response) => {
                // Agar response theek hai, to kuch mat karo
                return response;
            },
            (error) => {
                // Agar response mein error hai
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Agar error 401 (Unauthorized) hai, to session expire ho gaya
                    toast.error("Session Expired! Please log in again.");
                    logout(); // User ko logout kar do
                }
                // Error ko aage bhej do taaki component use handle kar sake
                return Promise.reject(error);
            }
        );

        // Cleanup function
        return () => {
            // Component ke hatne par interceptor ko bhi hata do
            axios.interceptors.response.eject(interceptor);
        };
    }, []); // Yeh useEffect sirf ek baar chalega jab app load hoga
    // --- NAYA CODE YAHAN KHATAM HUA ---


    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;