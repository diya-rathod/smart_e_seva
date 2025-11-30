// src/pages/visitor/TrackComplaint.js

import React from "react";
import { motion } from "framer-motion";
import {
  FiSend,
  FiUserCheck,
  FiTool,
  FiCheckCircle,
  FiSearch,
} from "react-icons/fi";

const timeline = [
  {
    icon: <FiSend />,
    title: "Submitted",
    desc: "Your complaint has been submitted successfully.",
    time: "Sept 12, 2025 - 05:10 PM",
    status: "completed",
  },
  {
    icon: <FiUserCheck />,
    title: "Agent Assigned",
    desc: "Agent: Ramesh Kumar",
    status: "active",
  },
  {
    icon: <FiTool />,
    title: "In Progress",
    desc: "The assigned agent is working on your issue.",
    status: "pending",
  },
  {
    icon: <FiCheckCircle />,
    title: "Resolved",
    desc: "The issue has been successfully resolved.",
    status: "pending",
  },
];

const TrackComplaint = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden transition-colors duration-300">

      {/* HERO */}
      <section className="pt-28 pb-16 text-center relative px-6">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 
            w-[550px] h-[300px] bg-emerald-500/20 dark:bg-emerald-600/40 
            blur-[140px] opacity-30">
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white"
        >
          Track Your <span className="text-emerald-500">Complaint</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
        >
          Enter your Complaint ID below to check real-time status & updates.
        </motion.p>
      </section>

      {/* SEARCH BOX */}
      <section className="px-6 md:px-20 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            max-w-2xl mx-auto
            bg-white dark:bg-[#0D1220]/70 
            backdrop-blur-xl 
            border border-gray-200 dark:border-slate-700/60 
            rounded-3xl shadow-lg dark:shadow-[0_0_25px_rgba(0,255,150,0.12)]
            p-6 md:p-8
          "
        >
          <form 
  className="flex flex-col md:flex-row gap-4"
  onSubmit={(e) => {
    e.preventDefault(); 
    console.log("Tracking complaint...");
  }}
>

            <input
              type="text"
              placeholder="Enter Complaint ID (e.g., TKT-12345)"
              className="
                flex-1 px-5 py-4 rounded-xl 
                bg-gray-100 dark:bg-slate-800 
                text-slate-900 dark:text-white 
                placeholder-gray-500 dark:placeholder-gray-400
                border border-gray-300 dark:border-slate-700
                focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                outline-none text-lg
              "
            />

            <button
              type="button"
              className="
                px-8 py-4 rounded-xl 
                font-semibold text-white text-lg 
                bg-emerald-600 hover:bg-emerald-500 
                shadow-md hover:shadow-lg 
                dark:bg-emerald-500 dark:text-slate-900
                flex items-center justify-center gap-2
                transition-all
              "
            >
              <FiSearch className="text-xl" />
              Track Status
            </button>
          </form>
        </motion.div>
      </section>

      {/* TIMELINE */}
      <section className="px-6 md:px-20 pb-20">
        <div className="max-w-3xl mx-auto relative">

          {/* Vertical Line */}
          <div className="absolute left-6 top-0 bottom-0 
            w-[3px]
            bg-gray-300 dark:bg-slate-700/70 
            dark:shadow-[0_0_20px_rgba(0,255,150,0.15)]
          ">
          </div>

          <div className="space-y-12">
            {timeline.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative pl-16"
              >
                {/* Icon */}
                <div
                  className={`
                    absolute left-0 top-1 
                    w-12 h-12 rounded-full flex items-center justify-center text-xl 
                    border-4 border-white dark:border-slate-900
                    shadow-md
                    ${
                      item.status === "completed"
                        ? "bg-emerald-500 text-white shadow-emerald-500/40"
                        : item.status === "active"
                        ? "bg-blue-500 text-white shadow-blue-500/40"
                        : "bg-gray-300 dark:bg-slate-700 text-gray-600"
                    }
                  `}
                >
                  {item.icon}
                </div>

                {/* Card */}
                <div
                  className="
                    bg-white dark:bg-[#0D1220]/60 
                    backdrop-blur-xl 
                    rounded-2xl p-6 
                    border border-gray-200 dark:border-slate-700/60
                    shadow-md dark:shadow-[0_0_20px_rgba(0,255,180,0.1)]
                    transition-all hover:-translate-y-1
                  "
                >
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>

                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {item.desc}
                  </p>

                  {item.time && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                      {item.time}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default TrackComplaint;
