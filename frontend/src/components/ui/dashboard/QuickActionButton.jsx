import React from "react";
import { motion } from 'framer-motion';

const QuickActionButton = ({ icon, label, onClick, variant = 'primary', disabled = false }) => {
  const variants = {
    primary: 'bg-slate-900 dark:bg-emerald-500 text-white hover:shadow-emerald-500/30',
    secondary: 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700',
    outline: 'bg-transparent border-2 border-slate-900 dark:border-emerald-500 text-slate-900 dark:text-emerald-500 hover:bg-slate-900 hover:text-white dark:hover:bg-emerald-500 dark:hover:text-white'
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-full font-semibold text-sm
        shadow-lg hover:shadow-xl transition-all duration-300
        flex items-center gap-2 justify-center
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

export default QuickActionButton;

