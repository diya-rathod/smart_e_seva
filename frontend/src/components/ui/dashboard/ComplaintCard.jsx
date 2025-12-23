// src/components/ui/dashboard/ComplaintCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import StatusChip from './StatusChip';
import { FiZap, FiDroplet, FiMapPin, FiTrash2, FiTool, FiAlertCircle } from 'react-icons/fi';

const ComplaintCard = ({ complaint, index }) => {
  // Category icon mapping
  const categoryIcons = {
    'Electricity': <FiZap className="text-yellow-500" />,
    'Water Supply': <FiDroplet className="text-blue-500" />,
    'Civic Issues': <FiMapPin className="text-red-500" />,
    'Waste Management': <FiTrash2 className="text-green-500" />,
    'Road Repair': <FiTool className="text-orange-500" />,
  };

  const categoryIcon = categoryIcons[complaint.category] || <FiAlertCircle className="text-gray-500" />;

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="group p-5 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 hover:shadow-lg dark:shadow-none transition-all duration-300"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Category & Ticket ID */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-xl border border-gray-100 dark:border-slate-700">
            {categoryIcon}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-slate-900 dark:text-white truncate">
              {complaint.category}
            </h4>
            <p className="text-xs font-mono text-gray-500 dark:text-gray-400">
              {complaint.ticketId}
            </p>
          </div>
        </div>

        {/* Date */}
        <div className="text-sm text-gray-600 dark:text-gray-400 hidden md:block">
          {formatDate(complaint.dateRaised)}
        </div>

        {/* Status */}
        <div>
          <StatusChip status={complaint.status} />
        </div>

        {/* Action Button */}
        <Link
          to={`/complaint/${complaint.ticketId}`}
          className="px-4 py-2 rounded-full bg-slate-900 dark:bg-emerald-500 text-white text-sm font-semibold hover:scale-105 transition-transform duration-200"
        >
          View
        </Link>
      </div>

      {/* Mobile Date (shown only on small screens) */}
      <div className="md:hidden mt-3 text-xs text-gray-500 dark:text-gray-400">
        Raised: {formatDate(complaint.dateRaised)}
      </div>
    </motion.div>
  );
};

export default ComplaintCard;
