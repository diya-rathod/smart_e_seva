import React from "react";

const CityInsights = () => {
  return (
    <div className="space-y-6 rounded-3xl border border-black/5 bg-white/80 p-8 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">
        City Insights
      </p>
      <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Data-driven civic intelligence</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        This section mirrors the visitor portal styling. Add municipality insights, seasonal alerts, and public metrics here.
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {["Flood Risk", "Power Coverage", "Water Quality"].map((metric) => (
          <div
            key={metric}
            className="rounded-2xl border border-black/5 bg-white p-4 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 shadow-sm dark:border-white/10 dark:bg-black/20"
          >
            {metric}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CityInsights;

