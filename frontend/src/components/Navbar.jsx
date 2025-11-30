import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname]);

  const handleScroll = () => setScrolled(window.scrollY > 20);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "Track Complaint", path: "/track-complaint" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b
        ${scrolled
          // Scrolled: Solid Clean Look (No Blur artifacts, just clean matte)
          ? "bg-white/90 border-gray-200 dark:bg-[#0F172A]/95 dark:border-slate-800 backdrop-blur-sm"
          // Top: Transparent
          : "bg-transparent border-transparent py-4"
        }
      `}
    >
      <div className="container mx-auto flex justify-between items-center px-6 max-w-7xl">
        
        {/* 1. LOGO */}
        <div className="text-2xl font-extrabold tracking-wide cursor-pointer flex items-center gap-2" onClick={() => navigate('/')}>
           <span className="text-slate-800 dark:text-white transition-colors">
             <span className="text-emerald-600 dark:text-emerald-400">Smart</span> E-Seva
           </span>
        </div>

        {/* 2. NAVIGATION PILL (THE TOGGLE EFFECT) */}
        {/* Container Pill: Grey background to hold the items */}
        <ul className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-transparent dark:border-slate-700 transition-colors">
          {navLinks.map((link) => (
            <li
              key={link.name}
              onClick={() => setActiveTab(link.path)}
              className="relative cursor-pointer z-10"
            >
              <NavLink
                to={link.path}
                className={`relative z-20 block px-5 py-2 text-sm font-semibold transition-colors duration-200
                  ${activeTab === link.path 
                    ? "text-white" // Active text is ALWAYS White
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
              >
                {link.name}
              </NavLink>

              {/* ✨ THE SLIDING PILL ANIMATION (No Glow, No Orange) ✨ */}
              {activeTab === link.path && (
                <motion.div
                  layoutId="navbar-pill"
                  className="absolute inset-0 z-10 rounded-full"
                  // 👇 Yahan change kiya: Solid Emerald Green for BOTH themes. No shadows.
                  style={{ 
                    backgroundColor: theme === 'dark' ? '#10B981' : '#059669', 
                    // Dark mode = Bright Emerald, Light mode = Deep Emerald
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </li>
          ))}
        </ul>

        {/* 3. RIGHT ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 rounded-full text-sm font-bold text-white transition-all transform active:scale-95
              bg-emerald-600 hover:bg-emerald-700 
              dark:bg-emerald-500 dark:hover:bg-emerald-400"
          >
            Login
          </button>
        </div>

        {/* MOBILE MENU BTN */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-slate-600 dark:text-slate-300">
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 dark:text-white text-2xl">
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white dark:bg-[#0F172A] border-t border-gray-100 dark:border-slate-800 px-6 py-4 absolute w-full shadow-xl"
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors
                    ${activeTab === link.path 
                       ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" 
                       : "text-slate-600 dark:text-slate-300"}`}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
            <li className="mt-2">
               <button 
                 onClick={() => { navigate("/login"); setIsOpen(false); }}
                 className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold text-center"
               >
                 Login
               </button>
            </li>
          </ul>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;