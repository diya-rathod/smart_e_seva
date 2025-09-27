import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = () => {
  return (
    <main className="auth-page-container">
      {/* Hero Section */}
      <section className="auth-hero">
        <h1>Welcome Back</h1>
        <p>Login to your account to track your complaints and manage your profile.</p>
      </section>

      {/* Login Form Section */}
      <section className="auth-content-section">
        <div className="auth-card">
          <h2>Login to Your Account</h2>
          <form className="auth-form">
            <div className="auth-form-group">
              <label htmlFor="email">Email or Phone</label>
              <input type="email" id="email" required />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            {/* --- YEH HAI LOGIN BUTTON --- */}
            <button type="submit" className="auth-button-submit">Login</button>
          </form>
          <div className="auth-switch">
            <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;