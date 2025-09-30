import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { FiGrid, FiUser, FiHelpCircle, FiLogOut } from 'react-icons/fi';

// Yahan props (isCollapsed, handleMouseEnter, handleMouseLeave) receive ho rahe hain
const Sidebar = ({ isCollapsed, handleMouseEnter, handleMouseLeave }) => {
  return (
    // Aur hover listeners ab aakhirkaar sahi jagah, yaani sidebar ke main div par lag gaye hain
    <div 
      className={isCollapsed ? 'sidebar collapsed' : 'sidebar'}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <div className="logo-container">
          <div className="logo-icon">S</div>
          <span className="logo-text">Smart E-Seva</span>
        </div>
      </div>

      <div className="user-profile">
        <div className="profile-pic"></div>
        <div className="profile-details">
          <span className="profile-name">Diya Rathod</span>
          <span className="profile-role">Citizen</span>
        </div>
      </div>

      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard" className="nav-link">
            <FiGrid className="nav-icon" />
            <span className="nav-text">My Complaints</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className="nav-link">
            <FiUser className="nav-icon" />
            <span className="nav-text">Profile & Settings</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/help" className="nav-link">
            <FiHelpCircle className="nav-icon" />
            <span className="nav-text">Support / Help</span>
          </NavLink>
        </li>
      </ul>

      <div className="sidebar-footer">
        <button className="logout-button">
          <FiLogOut className="nav-icon" />
          <span className="nav-text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;