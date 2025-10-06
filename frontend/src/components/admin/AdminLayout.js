import React from 'react';
import { Outlet } from 'react-router-dom';

// We will create a proper AdminSidebar later.
// For now, let's just have a simple placeholder.
const AdminSidebar = () => (
  <div style={{ width: '260px', height: '100vh', backgroundColor: '#343a40', color: 'white', position: 'fixed' }}>
    <h3 style={{ padding: '20px' }}>Admin Panel</h3>
    <ul style={{ listStyle: 'none', padding: '20px' }}>
      <li>Dashboard</li>
      <li>Manage Citizens</li>
      <li>Manage Agents</li>
    </ul>
  </div>
);

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main style={{ marginLeft: '260px', padding: '30px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Outlet /> {/* Admin pages will be rendered here */}
      </main>
    </div>
  );
};

export default AdminLayout;