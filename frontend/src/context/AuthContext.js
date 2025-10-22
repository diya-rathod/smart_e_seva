import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(() => {
        // On page load, try to get ALL auth info from localStorage
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        const email = localStorage.getItem('email');
        // FIX 1: 'mustChangePassword' ko bhi localStorage se padho
        const mustChangePassword = localStorage.getItem('mustChangePassword') === 'true'; // string ko boolean mein badlo

        if (token && role && email) {
            // FIX 2: State mein 'mustChangePassword' ko bhi set karo
            return { token, role, email, mustChangePassword };
        }
        return null;
    });

    const login = (token) => {
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;
        const email = decodedToken.sub;
        // FIX 3: Token se 'mustChangePassword' ki value nikalo
        const mustChangePassword = decodedToken.mustChangePassword; 

        // Sab kuchh localStorage mein save karo
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        localStorage.setItem('email', email);
        localStorage.setItem('mustChangePassword', mustChangePassword); // Nayi value save karo

        // Poora auth state set karo
        setAuth({ token, role, email, mustChangePassword });
    };

    const logout = () => {
        // Sab kuchh localStorage se saaf karo
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('email');
        localStorage.removeItem('mustChangePassword'); // FIX 4: Isko bhi remove karo
        setAuth(null);
        window.location.href = '/login';
    };

    // --- YEH NAYA FUNCTION ADD HUA HAI ---
    // Isko hum tab call karenge jab user password successfully badal lega
    const passwordChangedSuccessfully = () => {
        // State aur localStorage, dono ko update karo
        console.log("!!! passwordChangedSuccessfully function CALLED in AuthContext !!!");
        setAuth(prevAuth => ({ ...prevAuth, mustChangePassword: false }));
        localStorage.setItem('mustChangePassword', 'false');
    };
    // --- NAYA FUNCTION END ---

    // Session timeout waala interceptor (yeh pehle jaisa hi hai)
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    toast.error("Session Expired! Please log in again.");
                    logout();
                }
                return Promise.reject(error);
            }
        );
        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);


    return (
        // FIX 5: Naye function ko context value mein add karo
        <AuthContext.Provider value={{ auth, login, logout, passwordChangedSuccessfully }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
