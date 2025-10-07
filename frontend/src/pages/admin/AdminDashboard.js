import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import ComplaintsMap from './ComplaintsMap'; // Naye map component ko import karein

const AdminDashboard = () => {
    const { auth } = useContext(AuthContext);
    const userRole = auth?.role;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Live view of incoming complaints on the map.</p>

            {/* Map Component */}
            <div style={{ marginTop: '30px', marginBottom: '40px' }}>
                <ComplaintsMap />
            </div>

            {/* Quick Actions Section */}
            <div className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '20px' }}>
                    
                    <Link to="/admin/register-citizen" className="btn btn-primary">
                        + Register New Citizen
                    </Link>

                    <Link to="/admin/register-agent" className="btn btn-primary">
                        + Register New Agent
                    </Link>

                    {userRole === 'ROLE_SUPER_ADMIN' && (
                        <Link to="/admin/register-admin" className="btn btn-primary" style={{ backgroundColor: '#6f42c1' }}>
                            + Register New Admin
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;