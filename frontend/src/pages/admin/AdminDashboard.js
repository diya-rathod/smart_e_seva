import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // AuthContext ko import karein

const AdminDashboard = () => {
    // Get the current user's role from the context
    const { auth } = useContext(AuthContext);
    const userRole = auth?.role; // e.g., "ROLE_ADMIN" or "ROLE_SUPER_ADMIN"

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome! From here you can manage citizens, agents, and complaints.</p>

            <div style={{ marginTop: '40px', display: 'flex', gap: '20px' }}>
                
                {/* Link to Register Citizen */}
                <Link to="/admin/register-citizen" className="btn btn-primary">
                    + Register New Citizen
                </Link>

                {/* Link to Register Agent */}
                <Link to="/admin/register-agent" className="btn btn-primary">
                    + Register New Agent
                </Link>

                {/* --- IMPORTANT --- */}
                {/* Yeh link sirf SUPER_ADMIN ko dikhega */}
                {userRole === 'ROLE_SUPER_ADMIN' && (
                    <Link to="/admin/register-admin" className="btn btn-primary" style={{ backgroundColor: '#6f42c1' }}>
                        + Register New Admin
                    </Link>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;