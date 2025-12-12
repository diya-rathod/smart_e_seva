import React from "react";

const HelpCenter = () => {
  return (
    <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        Help Center
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Everything you need to know</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Browse FAQs, policy updates, and step-by-step guides to keep your civic reporting smooth.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {["Reporting Guidelines", "Live Tracking", "Complaint Lifecycle", "Feedback Channels"].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-black/5 bg-white/80 p-4 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpCenter;

