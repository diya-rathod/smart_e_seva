import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h1>Welcome, Admin!</h1>
      <p>This is the main dashboard for administrative tasks.</p>
       <Link to="/admin/register-citizen" className="btn btn-primary" style={{ marginTop: '30px' }}>
        + Register New Citizen
      </Link>
    </div>
  );
};

export default AdminDashboard;