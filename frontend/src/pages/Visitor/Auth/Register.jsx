import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../../services/authService'; // authService ko import karein
import './Login.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    authService.register(name, email, password).then(
      (response) => {
        alert("Registration Successful! Please login to continue.");
        navigate('/login'); // Redirect to login page on success
      },
      (error) => {
        console.log('Registration Failed:', error);
        alert('Registration Failed! Email might already be in use.');
      }
    );
  };

  return (
    <main className="auth-page-container">
      {/* ... Hero Section ... */}
      <section className="auth-content-section">
        <div className="auth-card">
          <h2>Create a New Account</h2>
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="submit" className="auth-button-submit">Create Account</button>
          </form>
          <div className="auth-switch">
            <p>Already have an account? <Link to="/login">Log In</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Register;