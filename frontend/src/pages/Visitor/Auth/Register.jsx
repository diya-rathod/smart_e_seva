import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css'; // We will reuse the same CSS as the Login page

const Register = () => {
  return (
    <main className="auth-page-container">
      {/* Hero Section */}
      <section className="auth-hero">
        <h1>Create Your Account</h1>
        <p>Join our platform to get your civic issues resolved faster.</p>
      </section>

      {/* Register Form Section */}
      <section className="auth-content-section">
        <div className="auth-card">
          <h2>Sign Up</h2>
          <form className="auth-form">
            <div className="auth-form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" required />
            </div>
            <div className="auth-form-group">
              <label htmlFor="email">Email or Phone</label>
              <input type="email" id="email" required />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" required />
            </div>
            <div className="auth-form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" id="confirmPassword" required />
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