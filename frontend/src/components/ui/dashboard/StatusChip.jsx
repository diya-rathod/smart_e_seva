import React from "react";

const statusStyles = {
  new: {
    bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-200",
  },
  "in-progress": {
    bg: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200",
  },
  resolved: {
    bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200",
  },
  default: {
    bg: "bg-slate-100 text-slate-700 dark:bg-slate-900/50 dark:text-slate-200",
  },
};

const StatusChip = ({ status }) => {
  const normalized = (status || "default").toLowerCase().replace(/\s+/g, "-");
  const styles = statusStyles[normalized] || statusStyles.default;

  return (
    <span
      role="status"
      aria-label={`Status: ${status}`}
      className={`inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.02em] leading-[1.3] ${styles.bg}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status || "Unknown"}
    </span>
  );
};

export default StatusChip;

