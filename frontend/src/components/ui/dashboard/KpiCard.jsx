import React from "react";
import { motion } from "framer-motion";

const KpiCard = ({ title, value, icon, color = 'blue', trend, index = 0 }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-500',
      text: 'text-blue-500',
      light: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      glow: 'shadow-blue-500/20'
    },
    green: {
      bg: 'bg-emerald-500',
      text: 'text-emerald-500',
      light: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      glow: 'shadow-emerald-500/20'
    },
    yellow: {
      bg: 'bg-amber-500',
      text: 'text-amber-500',
      light: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      glow: 'shadow-amber-500/20'
    },
    purple: {
      bg: 'bg-purple-500',
      text: 'text-purple-500',
      light: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      glow: 'shadow-purple-500/20'
    }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4 }}
      className="group relative p-6 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-lg hover:shadow-xl dark:shadow-none transition-all duration-300 overflow-hidden"
    >
      {/* Background Gradient Glow */}
      <div className={`absolute top-0 right-0 w-32 h-32 ${colors.light} rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
            {title}
          </p>
          <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white tracking-tight">
            {value}
          </h3>
          
          {/* Optional Trend Indicator */}
          {trend && (
            <div className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${trend.type === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              <span>{trend.type === 'up' ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>

        {/* Icon Container */}
        <div className={`w-14 h-14 rounded-2xl ${colors.light} border ${colors.border} flex items-center justify-center text-2xl ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default KpiCard;

