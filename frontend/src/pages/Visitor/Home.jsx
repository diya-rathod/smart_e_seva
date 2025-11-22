// src/pages/visitor/Home.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import repairmanAnimation from "./wireman.json";
import { FiArrowRight, FiUserCheck, FiZap, FiActivity } from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);

  const steps = ["Report", "Allocate", "Resolve"];

  const stats = [
    { id: 1, label: "Complaints Solved", value: "1,248", icon: <FiUserCheck /> },
    { id: 2, label: "Wiremen Active", value: "312", icon: <FiActivity /> },
    { id: 3, label: "Avg Resolve Time", value: "3.4 hrs", icon: <FiZap /> },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden relative">
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-28 grid md:grid-cols-2 gap-10 items-center">

        {/* Left Section */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Heading with gradient text */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-blue-600 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-500 bg-clip-text text-transparent">
              Empowering Citizens,
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 dark:from-yellow-500 dark:via-orange-500 dark:to-amber-400 bg-clip-text text-transparent">
              One Report at a Time.
            </span>
          </h1>

          {/* Subtext */}
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
            Instantly report electrical issues, track progress in real-time,
            and ensure accountability in your city’s power management.
          </p>

          {/* Steps Section */}
          <div className="mt-10">
            <h3 className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 font-semibold">
              Process Flow
            </h3>
            <div className="flex items-center gap-3">
              {steps.map((step, i) => (
                <React.Fragment key={i}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    onMouseEnter={() => setActiveStep(i + 1)}
                    className={`px-6 py-2.5 rounded-full text-sm md:text-base font-semibold transition-all border shadow-sm ${activeStep === i + 1
                        ? "bg-emerald-500 text-white border-emerald-500 dark:bg-amber-500 dark:text-slate-900 dark:border-amber-500"
                        : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-slate-700"
                      }`}
                  >
                    {step}
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="w-10 h-[2px] bg-gray-300 dark:bg-slate-600"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/raise-complaint")}
            className="mt-12 px-10 py-4 rounded-full bg-slate-900 text-white font-semibold text-lg flex items-center gap-3 shadow-lg hover:shadow-xl hover:bg-slate-800
                       dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 transition-all"
          >
            Raise a Complaint <FiArrowRight className="text-xl" />
          </motion.button>
        </motion.div>

        {/* Right Section — Animation + Stats */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="w-[85%] md:w-[420px] lg:w-[480px]">
            <Lottie animationData={repairmanAnimation} loop={true} />
          </div>

          {/* Floating Stat Cards */}
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: [0, -10, 0] }}
              transition={{
                duration: 2,
                delay: index * 0.3,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className={`absolute flex items-center gap-3 px-4 py-2.5 rounded-xl backdrop-blur-lg bg-white/70 dark:bg-slate-800/60 shadow-md border border-gray-200/60 dark:border-slate-700/60 ${index === 0
                  ? "top-4 left-2"
                  : index === 1
                    ? "bottom-10 right-0"
                    : "top-1/2 -right-10"
                }`}
            >
              <div className="text-xl text-emerald-600 dark:text-amber-400">
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
                <h4 className="font-bold text-gray-800 dark:text-white text-sm">
                  {stat.value}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      {/* Impact Stats Section */}
      <section className="mt-24 mb-16">
        <div className="container mx-auto px-6 md:px-12 lg:px-20 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">

          {[
            { value: "25K+", label: "Registered Citizens" },
            { value: "1.5 Lakh+", label: "Complaints Logged" },
            { value: "4 hrs Avg", label: "Resolution Time" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 rounded-2xl border
        bg-white border-gray-200 shadow-sm
        dark:bg-[#0F172A]/60 dark:border-[#1E293B] dark:shadow-[0_0_15px_rgba(255,255,255,0.04)]
        transition-all"
            >
              <h3 className="text-4xl font-extrabold text-emerald-600 dark:text-amber-400">
                {item.value}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">{item.label}</p>
            </div>
          ))}

        </div>
      </section>
      <section className="py-20 bg-[#FAFBF9] dark:bg-[#0A1120]">
  <div className="container mx-auto px-6 md:px-12 lg:px-20 text-center">

    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-12">
      How Smart E-Seva Works
    </h2>

    <div className="grid gap-8 md:grid-cols-3">

      {[
        { icon: "📍", title: "Report Issue", desc: "Submit complaint with location & photo." },
        { icon: "🧑‍🔧", title: "Allocate Wireman", desc: "Admin assigns nearest worker instantly." },
        { icon: "✅", title: "Resolve & Update", desc: "Wireman resolves & updates the status." },
      ].map((step, i) => (
        <div
          key={i}
          className="p-8 rounded-2xl border
          bg-white border-gray-200 shadow-sm
          hover:shadow-md transition-all
          dark:bg-[#0F172A]/60 dark:border-[#1E293B] dark:shadow-[0_0_15px_rgba(255,255,255,0.04)]"
        >
          <div className="w-14 h-14 mx-auto flex items-center justify-center text-3xl rounded-xl
          bg-emerald-100 text-emerald-600
          dark:bg-amber-400/15 dark:text-amber-400 mb-4"
          >
            {step.icon}
          </div>

          <h3 className="font-semibold text-lg text-slate-800 dark:text-white mb-2">
            {step.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{step.desc}</p>
        </div>
      ))}

    </div>
  </div>
</section>
<section className="py-20 text-center">
  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
    Join the Smart City Movement
  </h2>

  <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto mb-10">
    Your participation strengthens transparency and improves public services.
  </p>

  <button
    onClick={() => navigate("/raise-complaint")}
    className="px-10 py-4 rounded-full font-semibold text-lg
    bg-emerald-600 hover:bg-emerald-500 text-white shadow-md
    dark:bg-amber-500 dark:text-slate-900 dark:hover:bg-amber-400 transition-all"
  >
    Raise a Complaint
  </button>
</section>
<footer className="py-10 border-t border-gray-200 dark:border-slate-700 text-center">
  <p className="text-gray-600 dark:text-gray-400 text-sm">
    © 2025 Smart E-Seva — Designed for Citizens.
  </p>
</footer>


    </div>



  );
};

export default Home;
