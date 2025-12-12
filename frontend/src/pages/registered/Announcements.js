import React from "react";

const Announcements = () => {
  const updates = [
    {
      title: "Community Cleanup Drive",
      detail: "Volunteers deployed to 6 wards this weekend.",
    },
    {
      title: "Power Grid Maintenance",
      detail: "Rolling outages scheduled from 10 PM to 2 AM.",
    },
    {
      title: "Smart Water Sensors",
      detail: "New sensors will be installed in Sector 7 next week.",
    },
  ];

  return (
    <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        Announcements
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">City-wide news </h1>
      <div className="space-y-4">
        {updates.map((update) => (
          <div
            key={update.title}
            className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 text-sm text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <p className="font-semibold">{update.title}</p>
            <p className="text-[13px] text-slate-500 dark:text-slate-300">{update.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Announcements;

