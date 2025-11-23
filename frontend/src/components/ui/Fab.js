import React from 'react';
import ReactDOM from 'react-dom'; // Portal ke liye
import { Link, useLocation } from 'react-router-dom';
import './Fab.css';
import { FiPlus } from 'react-icons/fi';

const Fab = () => {
  const location = useLocation();

  // Raise Complaint page par button hide rahega
  if (location.pathname === '/raise-complaint') {
    return null;
  }

  // Button ko wapas Portal ka use karke render karenge
  return ReactDOM.createPortal(
    <Link to="/raise-complaint" className="fab">
      <FiPlus className="fab-icon" />
      <span className="fab-text">Raise Complaint</span>
    </Link>,
    document.body
  );
};

export default Fab;