// src/pages/auth/Login.js

import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import AuthContext from "../../../context/AuthContext";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Step 1: Backend API ko call karein
      // const response = await axios.post('https://smart-eseva-backend.onrender.com/api/v1/auth/login', {
      //   email: email,
      //   password: password
      // });
      const response = await axios.post(
        "http://localhost:8080/api/v1/auth/login",
        { email, password }
      );

      if (response.data && response.data.jwtToken) {
        const { jwtToken, role } = response.data;

        login(jwtToken, role);

        if (role === "ROLE_ADMIN" || role === "ROLE_SUPER_ADMIN") {
          navigate("/admin/dashboard");
        } else if (role === "ROLE_AGENT") {
          navigate("/agent/dashboard");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 flex items-center justify-center px-6 transition-all duration-300 overflow-hidden">

      {/* Glow Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 
          w-[600px] h-[350px] 
          bg-emerald-500/20 dark:bg-emerald-600/40 
          blur-[150px] opacity-40">
        </div>

        <div className="absolute bottom-[-20%] right-[10%] 
          w-[400px] h-[300px] 
          bg-blue-500/20 dark:bg-blue-800/40 
          blur-[150px] opacity-30">
        </div>
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative w-full max-w-md 
          p-10 rounded-3xl 
          bg-white dark:bg-[#0D1220]/70 
          backdrop-blur-xl 
          border border-gray-200 dark:border-slate-700/60 
          shadow-2xl dark:shadow-[0_0_40px_rgba(0,255,150,0.1)]
        "
      >
        <h2 className="text-3xl font-extrabold text-center text-slate-900 dark:text-white mb-6">
          Welcome Back 👋
        </h2>

        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Login to continue your Smart E-Seva experience
        </p>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="mb-4 p-3 rounded-xl text-sm text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300 text-center border border-red-200 dark:border-red-700">
            {error}
          </p>
        )}

        {/* LOGIN FORM */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">

          {/* Email */}
          <div className="flex items-center gap-3 
            px-4 py-3 rounded-xl 
            bg-gray-100 dark:bg-slate-800 
            border border-gray-300 dark:border-slate-700">
            
            <FiMail className="text-gray-500 dark:text-gray-400 text-xl" />

            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="
                flex-1 bg-transparent outline-none 
                text-slate-900 dark:text-white
              "
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 
            px-4 py-3 rounded-xl 
            bg-gray-100 dark:bg-slate-800 
            border border-gray-300 dark:border-slate-700">

            <FiLock className="text-gray-500 dark:text-gray-400 text-xl" />

            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="
                flex-1 bg-transparent outline-none 
                text-slate-900 dark:text-white
              "
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="
              w-full py-4 rounded-xl mt-2
              font-semibold text-lg text-white 
              bg-emerald-600 hover:bg-emerald-500
              dark:bg-emerald-500 dark:text-slate-900
              shadow-lg hover:shadow-emerald-400/30 
              transition-all flex items-center justify-center gap-2
            "
          >
            <FiLogIn className="text-xl" />
            Login
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
