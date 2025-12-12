import React from "react";
import {
  bodyTextClass,
  mutedLabelClass,
  timestampClass,
} from "../../../styles/dashboardTypography";

const ActivityItem = ({ icon, title, description, timestamp }) => {
  return (
    <article
      className="space-y-3 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition duration-200 dark:border-white/10 dark:bg-white/5"
      aria-label={`${title} • ${description}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white">
          {icon}
        </span>
        <div className="flex-1 space-y-1">
          <p className="text-base font-semibold leading-[1.3] text-slate-900 dark:text-white">{title}</p>
          <p className={`${timestampClass}`}>{timestamp}</p>
        </div>
      </div>
      <p className={`${bodyTextClass}`}>{description}</p>
    </article>
  );
};

export default ActivityItem;

