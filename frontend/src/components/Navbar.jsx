import React from 'react';
// useNavigate ko import karein, button ke liye zaroori hai
import { NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  // useNavigate ko initialize karein
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">Smart E-Seva</NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/how-it-works">How It Works</NavLink></li>
        <li><NavLink to="/track-complaint">Track Complaint</NavLink></li>
        <li><NavLink to="/contact">Contact</NavLink></li>
      </ul>
      {/* --- LOGIN BUTTON WAPAS ADD KIYA GAYA --- */}
      <div className="navbar-auth">
        <button className="auth-button" onClick={() => navigate('/login')}>
          Login 
        </button>
      </div>
    </nav>
  );
};

export default Navbar;