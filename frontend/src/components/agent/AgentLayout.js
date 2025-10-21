//frontend/src/components/agent/AgentLayout.js

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../dashboard/Sidebar'; // Sidebar component ko reuse karein
import Fab from '../ui/Fab'; 
// FIX: AgentLayout.css file create karke yahan import karein
import '../dashboard/RegisteredLayout.css'; // Temporarily Citizen/Registered layout CSS use karte hain

const AgentLayout = () => {
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
    // Optional: Yahan par Agent-specific menu props bhej sakte hain
   />
   <div className="main-content">
    <Outlet /> {/* Agent Dashboard yahan render hoga */}
   </div>

   <Fab /> 
  </div>
 );
};

export default AgentLayout;