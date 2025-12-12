import React from "react";

const SettingsPage = () => {
  const options = ["Notification Preferences", "Privacy", "Push Alerts", "Account Security"];

  return (
    <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        Settings
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Configure your preferences</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <div
            key={option}
            className="rounded-2xl border border-black/5 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            {option}
            <p className="text-[13px] font-normal text-slate-500 dark:text-slate-300">
              Manage {option.toLowerCase()} and keep your profile secure.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsPage;

