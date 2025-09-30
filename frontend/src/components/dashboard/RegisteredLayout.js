import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './RegisteredLayout.css';

const RegisteredLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleMouseEnter = () => {
    setSidebarCollapsed(false);
  };

  const handleMouseLeave = () => {
    setSidebarCollapsed(true);
  };

  return (
    // Dekhiye, yahan se onMouseEnter aur onMouseLeave hata diya gaya hai
    <div className={isSidebarCollapsed ? 'layout-container collapsed' : 'layout-container'}>
      {/* Humne functions ko yahan props ke through pass kar diya hai */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default RegisteredLayout;