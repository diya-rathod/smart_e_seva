// import React, { useState, useContext } from 'react';
// // Step 1: Link ke saath useNavigate ko bhi import karein
// import { Link, useNavigate } from 'react-router-dom'; 
// import authService from '../../../services/authService';
// import AuthContext from '../../../context/AuthContext';
// import './Login.css';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate(); // Step 2: useNavigate ko initialize karein

//   const handleLogin = (e) => {
//     e.preventDefault();

//     authService.login(email, password).then(
//       (response) => {
//         // Call the context login function with the token
//         login(response.data.token);

//         // Step 3: Successful login ke baad dashboard par redirect karein
//         navigate('/dashboard'); 
//       },
//       (error) => {
//         console.log('Login Failed:', error);
//         alert('Login Failed! Invalid credentials.');
//       }
//     );
//   };

//   return (
//     // ... Aapka baaki ka JSX code bilkul same rahega ...
//     <main className="auth-page-container">
//       <section className="auth-content-section">
//         <div className="auth-card">
//           <h2>Login to Your Account</h2>
//           <form className="auth-form" onSubmit={handleLogin}>
//             <div className="auth-form-group">
//               <label htmlFor="email">Email</label>
//               <input 
//                 type="email" 
//                 id="email" 
//                 required 
//                 value={email} 
//                 onChange={(e) => setEmail(e.target.value)} 
//               />
//             </div>
//             <div className="auth-form-group">
//               <label htmlFor="password">Password</label>
//               <input 
//                 type="password" 
//                 id="password" 
//                 required 
//                 value={password} 
//                 onChange={(e) => setPassword(e.target.value)} 
//               />
//             </div>
//             <button type="submit" className="auth-button-submit">Login</button>
//           </form>
//           <div className="auth-switch">
//             <p>Don't have an account? <Link to="/register">Sign Up</Link></p>
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Login;



import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // axios ko import karein
import AuthContext from '../../../context/AuthContext'; // Aapke AuthContext ka path
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // Error message ke liye state
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Purane error ko clear karein

    try {
      // Step 1: Backend API ko call karein
      const response = await axios.post('https://smart-eseva-backend.onrender.com/api/v1/auth/login', {
        email: email,
        password: password
      });

      if (response.data && response.data.jwtToken) {
        const { jwtToken, role } = response.data;

        // Step 2: Context mein token aur user info save karein
        // Hum maan rahe hain ki aapka login function token aur role le sakta hai
        login(jwtToken, role);

        // Step 3: Role ke hisab se redirect karein
        if (role === 'ROLE_ADMIN' || role === 'ROLE_SUPER_ADMIN')  {
          navigate('/admin/dashboard');
        }  else if (role === 'ROLE_AGENT') { // ⬅️ NEW AGENT REDIRECTION LOGIC ADDED
            navigate('/agent/dashboard');
        }else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again."); // User ko error dikhayein
    }
  };

  return (
    <main className="auth-page-container">
      <section className="auth-content-section">
        <div className="auth-card">
          <h2>Login to Your Account</h2>
          <form className="auth-form" onSubmit={handleLogin}>
            {/* Error message dikhane ke liye */}
            {error && <p className="error-message">{error}</p>}
            
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
          
        </div>
      </section>
    </main>
  );
};

export default Login;