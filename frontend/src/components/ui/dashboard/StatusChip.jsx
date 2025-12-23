import React from "react";

const StatusChip = ({ status }) => {
  const statusConfig = {
    'New': {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-300',
      border: 'border-blue-200 dark:border-blue-800',
      dot: 'bg-blue-500'
    },
    'In-Progress': {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
    'Resolved': {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500'
    },
    'Closed': {
      bg: 'bg-gray-100 dark:bg-gray-800/30',
      text: 'text-gray-700 dark:text-gray-300',
      border: 'border-gray-200 dark:border-gray-700',
      dot: 'bg-gray-500'
    },
    'Rejected': {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-300',
      border: 'border-red-200 dark:border-red-800',
      dot: 'bg-red-500'
    }
  };

  const config = statusConfig[status] || statusConfig['New'];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${status === 'In-Progress' ? 'animate-pulse' : ''}`}></span>
      {status}
    </span>
  );
};

export default StatusChip;

