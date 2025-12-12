// src/components/dashboard/RegisteredLayout.js

import React, { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  PlusCircle,
  ClipboardList,
  Activity,
  User,
  Settings,
  HelpCircle,
  BookOpen,
  Megaphone,
  Bell,
  Sun,
  Moon,
  ChevronDown,
} from "lucide-react";
import AuthContext from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import NavItem from "../ui/NavItem";
import ForcePasswordChangeModal from "../common/ForcePasswordChangeModal";
import "./RegisteredLayout.css";

const navSections = [
  {
    label: "MAIN",
    items: [
      { label: "Dashboard", to: "/dashboard", icon: Home },
      { label: "Raise Complaint", to: "/raise-complaint", icon: PlusCircle },
      { label: "My Complaints", to: "/my-complaints", icon: ClipboardList },
      { label: "Track Status", to: "/track-complaint", icon: Activity },
    ],
  },
  {
    label: "SUPPORT",
    items: [
      { label: "Profile", to: "/profile", icon: User },
      { label: "Settings", to: "/settings", icon: Settings },
      { label: "Help Center", to: "/help-center", icon: HelpCircle },
      { label: "City Insights", to: "/city-insights", icon: BookOpen },
      { label: "Announcements", to: "/announcements", icon: Megaphone },
    ],
  },
];

const RegisteredLayout = () => {
  const { auth, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  if (auth?.mustChangePassword) {
    return <ForcePasswordChangeModal />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
      <aside className="fixed inset-y-0 z-20 hidden w-[260px] flex-col gap-6 border-r border-black/5 bg-white/60 px-5 py-6 backdrop-blur-xl dark:border-white/10 dark:bg-white/5 md:flex">
        <div className="flex flex-col gap-1">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Smart E-Seva</p>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">
            Citizen Panel
          </p>
        </div>

        <div className="space-y-4">
          {navSections.map((section) => (
            <div key={section.label} className="space-y-2">
              <span className="px-3 text-[11px] uppercase tracking-[0.12em] text-slate-400">
                {section.label}
              </span>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavItem key={item.label} label={item.label} to={item.to} icon={item.icon} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-black/5 pt-4 dark:border-white/10">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full items-center justify-between rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm font-medium text-slate-700 transition duration-200 hover:-translate-x-0.5 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          >
            <span>Theme</span>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-between rounded-xl border border-transparent bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-600 transition duration-200 hover:-translate-x-0.5 hover:bg-emerald-500/20"
          >
            Logout
            <ChevronDown className="h-4 w-4" />
          </button>
          <p className="text-xs uppercase tracking-[0.12em] text-slate-400 dark:text-slate-500">v1.0.0</p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col md:pl-[260px]">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-black/5 bg-white/70 px-6 backdrop-blur-lg dark:border-white/10 dark:bg-white/5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Citizen Dashboard
            </p>
            <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Overview
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/60 shadow-sm transition duration-200 hover:scale-105 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              >
                <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              </button>
              <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-emerald-500 text-[10px] text-white">
                2
              </span>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-black/5 bg-white/60 shadow-sm transition duration-200 hover:scale-105 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              ) : (
                <Sun className="h-5 w-5 text-slate-600 dark:text-slate-300" />
              )}
            </button>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white/60 px-3 py-1 shadow-sm transition duration-200 hover:scale-105 hover:shadow-lg dark:border-white/10 dark:bg-white/5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-white">
                {auth?.name?.[0] || "C"}
              </span>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{auth?.name || "Citizen"}</p>
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400 dark:text-slate-300">
                  {auth?.role || "Citizen"}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden px-6 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default RegisteredLayout;
