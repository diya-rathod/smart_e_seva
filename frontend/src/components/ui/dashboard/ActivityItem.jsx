import React from "react";
import { FiCheck, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi';

const ActivityItem = ({ type, message, timestamp, ticketId }) => {
  const typeConfig = {
    resolved: {
      icon: <FiCheck />,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    assigned: {
      icon: <FiUser />,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20'
    },
    'in-progress': {
      icon: <FiClock />,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    new: {
      icon: <FiAlertCircle />,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    }
  };

  const config = typeConfig[type] || typeConfig.new;

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow duration-300">
      {/* Icon */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center border ${config.border}`}>
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {message}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {timestamp}
          </span>
          {ticketId && (
            <>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <span className="text-xs font-mono text-gray-600 dark:text-gray-400">
                {ticketId}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;

