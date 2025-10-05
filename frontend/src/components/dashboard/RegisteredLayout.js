import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Fab from '../ui/Fab'; // <-- Step 1: Ensure FAB is imported
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
    <div 
      className={isSidebarCollapsed ? 'layout-container collapsed' : 'layout-container'}
    >
      <Sidebar 
        isCollapsed={isSidebarCollapsed} 
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
      />
      <div className="main-content">
        <Outlet />
      </div>

      <Fab /> {/* <-- Step 2: Ensure FAB component is called here */}
    </div>
  );
};

export default RegisteredLayout;