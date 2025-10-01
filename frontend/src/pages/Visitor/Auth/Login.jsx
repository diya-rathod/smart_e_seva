import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../../services/authService'; // authService ko import karein
import AuthContext from '../../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

    const handleLogin = (e) => {
    e.preventDefault();

    authService.login(email, password).then(
      (response) => {
        // Call the context login function with the token
        login(response.data.token);
      },
      (error) => {
        console.log('Login Failed:', error);
        alert('Login Failed! Invalid credentials.');
      }
    );
  };

  return (
    <main className="auth-page-container">
      {/* ... Hero Section ... */}
      <section className="auth-content-section">
        <div className="auth-card">
          <h2>Login to Your Account</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                required 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                required 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
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