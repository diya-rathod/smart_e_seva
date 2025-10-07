import React, { useContext } from 'react'; // useContext ko import karein
import { Outlet, NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'; // AuthContext ko import karein

const AdminSidebar = () => {
    // Get the current user's role from the context
    const { auth } = useContext(AuthContext);
    const userRole = auth?.role;

    return (
        <div className="sidebar"> 
            <div className="sidebar-header">
                <span className="logo-text">Admin Panel</span>
            </div>
            <ul className="sidebar-nav">
                <li>
                    <NavLink to="/admin/dashboard" className="nav-link">Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/register-citizen" className="nav-link">Register Citizen</NavLink>
                </li>
                <li>
                    <NavLink to="/admin/register-agent" className="nav-link">Register Agent</NavLink>
                </li>
                <li><NavLink to="/admin/manage-complaints" className="nav-link">Manage Complaints</NavLink></li>

                {/* --- YEH NAYA CONDITIONAL LINK ADD HUA HAI --- */}
                {/* Yeh link sirf SUPER_ADMIN ko dikhega */}
                {userRole === 'ROLE_SUPER_ADMIN' && (
                    <li>
                        <NavLink to="/admin/register-admin" className="nav-link">
                            Register New Admin
                        </NavLink>
                    </li>
                )}
            </ul>
        </div>
    );
};

const AdminLayout = () => {
    return (
        <div className="admin-layout" style={{ display: 'flex' }}>
            <AdminSidebar />
            <main style={{ marginLeft: '260px', padding: '30px', flexGrow: 1, backgroundColor: '#f8f9fa' }}>
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;