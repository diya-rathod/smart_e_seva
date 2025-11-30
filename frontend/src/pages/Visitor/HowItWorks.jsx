// src/pages/visitor/HowItWorks.js
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import {
  FiSend,
  FiUserCheck,
  FiCheckCircle,
  FiArrowRightCircle,
} from "react-icons/fi";

const steps = [
  {
    icon: <FiSend />,
    title: "Submit Your Complaint",
    desc: "Report the issue by uploading photos and providing details. Your location is auto-detected for accuracy.",
  },
  {
    icon: <FiUserCheck />,
    title: "We Assign an Agent",
    desc: "Our system instantly alerts the admin, who verifies your request and assigns the nearest available field worker.",
  },
  {
    icon: <FiCheckCircle />,
    title: "Problem Resolved",
    desc: "The field agent fixes the issue and updates real-time status. You get an instant notification once it’s done.",
  },
];

const HowItWorks = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300 overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="pt-28 pb-20 relative text-center px-6 md:px-20">
        
        {/* Improved Glow for Dark Mode */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-[-10%] -translate-x-1/2 
            w-[600px] h-[300px] 
            bg-emerald-500/20 dark:bg-emerald-500/40 
            rounded-full blur-[160px] opacity-30">
          </div>

          <div className="absolute bottom-[-20%] right-[5%] w-[350px] h-[350px]
            bg-blue-500/20 dark:bg-blue-800/40 
            rounded-full blur-[160px] opacity-20">
          </div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white"
        >
          A Clear Path to <span className="text-emerald-500">Resolution</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
        >
          A simple, transparent, and efficient 3-step process designed for citizens.
        </motion.p>
      </section>

      {/* --- TIMELINE STEPS --- */}
      <section className="py-16 relative">
        <div className="container mx-auto px-6 md:px-20">

          {/* Improved Dark Mode Line */}
          <div className="hidden md:block absolute left-1/2 top-0 w-1 h-full 
            bg-gray-200 dark:bg-slate-700/70 
            dark:shadow-[0_0_25px_rgba(0,200,150,0.15)]
            transform -translate-x-1/2">
          </div>

          <div className="grid md:grid-cols-1 gap-20 relative">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className={`relative flex md:w-[70%] ${
                  i % 2 === 0 ? "md:ml-auto text-left" : "md:mr-auto text-left"
                }`}
              >

                {/* Connector Dot */}
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-0 
                    w-6 h-6 rounded-full 
                    bg-emerald-500 border-4 border-white 
                    dark:border-slate-900">
                </div>

                {/* Updated Dark Mode Step Card */}
                <div className="
                  bg-white 
                  dark:bg-[#0D1220]/70 
                  backdrop-blur-xl 
                  p-8 rounded-3xl 
                  border 
                  border-gray-100 
                  dark:border-slate-700/60 
                  shadow-lg 
                  dark:shadow-[0_0_25px_rgba(0,0,0,0.4)]
                  relative z-10
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-xl
                  dark:hover:shadow-[0_0_35px_rgba(0,255,150,0.15)]
                ">
                  <div className="flex items-center gap-4 mb-4">

                    {/* Updated Icon Glow */}
                    <div className="
                      w-16 h-16 rounded-full 
                      bg-emerald-100 dark:bg-emerald-500/10 
                      flex items-center justify-center text-2xl 
                      text-emerald-600 dark:text-emerald-400 
                      border-4 border-white dark:border-slate-800 
                      shadow-md dark:shadow-[0_0_15px_rgba(0,255,180,0.2)]
                    ">
                      {step.icon}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {i + 1}. {step.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 text-center relative overflow-hidden">

        {/* Better Dark Mode Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 
            w-[600px] h-[250px] 
            bg-emerald-500/20 dark:bg-emerald-600/30 
            blur-[150px] opacity-30">
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Start Your Complaint in Minutes
          </h2>

          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
            Our platform ensures every issue is tracked, assigned, and resolved with complete transparency.
          </p>

          <button
  onClick={() => navigate("/login")}
  className="px-10 py-4 rounded-full font-bold text-lg 
    bg-slate-900 dark:bg-emerald-500 
    text-white dark:text-slate-900 
    shadow-xl hover:scale-105 transition-all 
    flex items-center gap-3 mx-auto"
>
  Get Started <FiArrowRightCircle className="text-2xl" />
</button>

        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
