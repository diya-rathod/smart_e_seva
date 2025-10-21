//frontend/src/components/common/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

/**
 * Role-based access control ke liye component.
 * Ensures ki user authenticated aur required role mein ho.
 */
const ProtectedRoute = ({ allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth.token) {
        // Not logged in -> Redirect to login page
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles || allowedRoles.includes(auth.role)) {
        // Role allowed hai ya koi restriction nahi hai
        return <Outlet />; // Render the child route component
    }

    // Role allowed nahi hai -> Redirect to a default dashboard or unauthorized page
    // Citizen ko uske dashboard par, Admin ko uske dashboard par.
    if (auth.role === 'ROLE_ADMIN' ) {
        return <Navigate to="/admin/dashboard" replace />;
    } else if (auth.role === 'ROLE_AGENT') {
        return <Navigate to="/agent/dashboard" replace />; // Agent ko Agent Dashboard par
    } else if (auth.role === 'ROLE_CITIZEN') {
        return <Navigate to="/dashboard" replace />; // Citizen ko Citizen Dashboard par
    }
    
    // Fallback for unauthorized
    return <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;