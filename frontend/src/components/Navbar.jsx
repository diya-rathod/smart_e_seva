// src/components/Navbar.js (Innovated)

import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Navbar = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);

    // ✨ NEW: active tab ko track karne ke liye
    // Hum useLocation ka use karenge taaki page refresh par bhi active link sahi rahe
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.pathname);

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
            // 🎨 CHANGED: Glassmorphism effect ko aur behtar banaya
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300
                  ${scrolled
                    ? "shadow-lg shadow-black/5 dark:shadow-black/20"
                    : "shadow-none"
                }
                  bg-white/70 backdrop-blur-lg dark:bg-[#1A202C]/70
                  border-b border-gray-200/80 dark:border-slate-800/80`}
        >
            <div className="container mx-auto flex justify-between items-center px-6 max-w-7xl py-3">
                {/* Brand Logo */}
                <div className="text-2xl font-extrabold tracking-wide">
                    <NavLink to="/" className="text-slate-800 dark:text-white">
                        <span className="text-emerald-500 dark:text-amber-400">Smart</span> E-Seva
                    </NavLink>
                </div>

                {/* ✨ NEW: Navigation Links with Sliding Pill Effect */}
                <ul className="hidden md:flex items-center justify-center gap-2 rounded-full p-1.5 bg-gray-100 dark:bg-slate-800/50">
                    {navLinks.map((link) => (
                        <li
                            key={link.name}
                            onClick={() => setActiveTab(link.path)}
                            className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors
                                ${activeTab === link.path
                                    ? "text-white dark:text-slate-900" // Active text color
                                    : "text-gray-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            {activeTab === link.path && (
                                <motion.div
                                    layoutId="navbar-pill" // Yeh ID animation ko sync karti hai
                                    className="absolute inset-0 z-0 bg-emerald-500 dark:bg-amber-400"
                                    style={{ borderRadius: 9999 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <NavLink to={link.path} className="relative z-10">
                                {link.name}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Actions: Login & Theme Toggle */}
                <div className="hidden md:flex items-center space-x-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/login")}
                        className="px-6 py-2 rounded-full font-semibold transition-all duration-300
                       bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20
                       dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 dark:shadow-amber-500/20"
                    >
                        Login
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1, rotate: 15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-full text-xl transition-colors duration-300
                       bg-gray-200 text-emerald-600
                       dark:bg-slate-800 dark:text-amber-400"
                    >
                        {theme === "light" ? <FiMoon /> : <FiSun />}
                    </motion.button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;