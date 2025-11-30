// src/components/dashboard/Sidebar.js
import React from "react";
import { NavLink } from "react-router-dom";
import {
  FiGrid,
  FiPlusCircle,
  FiUser,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import "./Sidebar.css";

const Sidebar = ({ isOpen, onHoverIn, onHoverOut, onLogout }) => {
  return (
    <div
      className={`sidebar-container ${isOpen ? "expanded" : "collapsed"}`}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      {/* LOGO AREA */}
      <div className="sidebar-logo">
        <div className="logo-circle">⚡</div>
        {isOpen && <div className="logo-text">Smart E-Seva</div>}
      </div>

      {/* NAVIGATION */}
      <ul className="sidebar-nav">
        <li>
          <NavLink to="/dashboard" className="nav-item">
            <FiGrid className="nav-icon" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
        </li>

        <li>
          <NavLink to="/raise-complaint" className="nav-item">
            <FiPlusCircle className="nav-icon" />
            {isOpen && <span>Raise Complaint</span>}
          </NavLink>
        </li>

        <li>
          <NavLink to="/profile" className="nav-item">
            <FiUser className="nav-icon" />
            {isOpen && <span>Profile</span>}
          </NavLink>
        </li>

        <li>
          <NavLink to="/help" className="nav-item">
            <FiHelpCircle className="nav-icon" />
            {isOpen && <span>Help</span>}
          </NavLink>
        </li>
      </ul>

      {/* LOGOUT */}
      <div className="sidebar-logout">
        <button className="logout-btn" onClick={onLogout}>
          <FiLogOut className="nav-icon logout-icon" />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
