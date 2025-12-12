import React from "react";

const QuickActionButton = ({ label, icon, onClick, variant = "primary" }) => {
  const base =
    "flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold tracking-[0.02em] leading-[1.5] transition duration-200 hover:shadow-[0_2px_10px_rgba(0,0,0,0.06)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400";

  const variantClasses = {
    primary: "border-black/5 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white",
    ghost: "bg-transparent text-slate-600 dark:text-slate-300",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`${base} ${variantClasses[variant] || variantClasses.primary}`}
    >
      <span className="h-5 w-5">{icon}</span>
      {label}
    </button>
  );
};

export default QuickActionButton;

