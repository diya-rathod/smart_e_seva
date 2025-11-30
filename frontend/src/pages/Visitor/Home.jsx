// src/pages/visitor/Home.js
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import repairmanAnimation from "./wireman.json"; 
import {
  FiArrowRight,
  FiZap,
  FiSearch,
  FiDroplet,
  FiMapPin,
  FiCamera,
  FiCpu,
  FiCheckCircle
} from "react-icons/fi";

const Home = () => {
  const navigate = useNavigate();
  const steps = ["Report", "Allocate", "Resolve"];

  // Services Data
  const services = [
    { 
      title: "Electricity", 
      icon: <FiZap />, 
      desc: "Power cuts, street lights, wiring issues.",
      color: "text-yellow-500",
      bg: "bg-yellow-500",
      border: "group-hover:border-yellow-500"
    },
    { 
      title: "Water Supply", 
      icon: <FiDroplet />, 
      desc: "Leakage, contaminated water, supply stop.",
      color: "text-blue-500",
      bg: "bg-blue-500",
      border: "group-hover:border-blue-500"
    },
    { 
      title: "Civic Issues", 
      icon: <FiMapPin />, 
      desc: "Potholes, garbage, drainage problems.",
      color: "text-red-500",
      bg: "bg-red-500",
      border: "group-hover:border-red-500"
    },
  ];

  // Stats Data for Hero Floating Cards
  const heroStats = [
    { id: 1, label: "Complaints Solved", value: "1,248", icon: "✅" },
    { id: 2, label: "Wiremen Active", value: "312", icon: "⚡" },
    { id: 3, label: "Avg Resolve Time", value: "3.4 hrs", icon: "⏱️" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">

      {/* --- BACKGROUND NOISE & BLUR --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 pt-32 pb-20 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Live Complaint Tracking System</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight text-slate-900 dark:text-white tracking-tight mb-6">
            Smart City, <br />
            <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">
              Smarter Living.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">
            Empowering citizens to report issues instantly. Join the movement to make your city cleaner, safer, and more efficient.
          </p>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/raise-complaint")}
              className="px-8 py-4 rounded-full bg-slate-900 dark:bg-emerald-500 text-white font-semibold text-lg shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center gap-2"
            >
              Raise Complaint <FiArrowRight />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/track-complaint")}
              className="px-8 py-4 rounded-full border-2 border-gray-200 dark:border-slate-700 text-slate-700 dark:text-white font-semibold text-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <FiSearch /> Track Status
            </motion.button>
          </div>

          {/* Process Steps */}
          <div className="mt-12 flex items-center gap-4 text-sm font-medium text-gray-500 dark:text-gray-400">
             {steps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                   <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${i === 0 ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-300'}`}>
                     {i+1}
                   </span>
                   {step}
                   {i !== steps.length - 1 && <div className="w-8 h-[1px] bg-gray-300"></div>}
                </div>
             ))}
          </div>
        </motion.div>

        {/* Right Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl transform scale-75"></div>
          <div className="w-[90%] md:w-[500px] relative z-10">
            <Lottie animationData={repairmanAnimation} loop={true} />
          </div>

          {/* Floating Stats on Hero Image */}
          {heroStats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
              className={`absolute flex items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md bg-white/80 dark:bg-slate-800/80 shadow-xl border border-white/20 dark:border-slate-700/50 ${
                index === 0 ? "top-10 -left-4 md:left-0" : 
                index === 1 ? "bottom-20 -right-4 md:right-0" : 
                "top-1/2 -right-8 md:-right-10"
              }`}
            >
              <div className="text-xl">{stat.icon}</div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                <h4 className="font-bold text-slate-900 dark:text-white">{stat.value}</h4>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* --- INNOVATIVE SERVICES SECTION --- */}
      <section className="py-16 relative z-10">
         <div className="container mx-auto px-6 md:px-20">
            <div className="mb-12 md:mb-16">
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white">What can you report?</h2>
               <div className="w-20 h-1 bg-emerald-500 mt-2 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
               {services.map((service, i) => (
                  <div 
                     key={i}
                     onClick={() => navigate('/login')}
                     className={`group relative p-8 rounded-3xl bg-white dark:bg-slate-900 
                        border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl 
                        transition-all duration-300 cursor-pointer overflow-hidden
                        border-b-4 border-b-transparent ${service.border}`}
                  >
                     <div className={`absolute top-0 right-0 w-32 h-32 ${service.bg} opacity-0 group-hover:opacity-10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity duration-500`}></div>

                     <div className="relative z-10">
                        <div className={`w-16 h-16 rounded-2xl ${service.bg} bg-opacity-10 flex items-center justify-center text-3xl ${service.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                           {service.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:translate-x-1 transition-transform">{service.title}</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">{service.desc}</p>
                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                           <span className={service.color}>Report Now</span>
                           <FiArrowRight className={service.color} />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* --- INNOVATIVE STATS STRIP (Fixed & Cleaned) --- */}
     {/* --- STATS STRIP (Fixed Theme & Alignment) --- */}
      <section className="py-10">
        <div className="container mx-auto px-6 md:px-12">
          
          {/* Container: Light(White) vs Dark(Navy) */}
          <div className="relative rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#0F172A] border border-gray-200 dark:border-slate-800 shadow-xl transition-colors duration-300">
            
            {/* Background Glow (Subtle) */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-full bg-gradient-to-r from-transparent via-emerald-500/5 dark:via-emerald-900/20 to-transparent blur-3xl pointer-events-none"></div>

            {/* Grid with Dynamic Dividers */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 divide-y divide-gray-100 dark:divide-slate-800 md:divide-y-0 md:divide-x">
              
              {[
                { label: "Citizens Joined", value: "25K+", sub: "Trusted by people" },
                { label: "Complaints Solved", value: "1.5L+", sub: "In record time" },
                { label: "Success Rate", value: "98%", sub: "Issues Resolved" },
                { label: "Avg Resolution", value: "4 Hrs", sub: "Lightning Fast" },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="relative p-8 text-center group hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors duration-300 cursor-default flex flex-col justify-center h-full"
                >
                  {/* Live Indicator - Absolute Position to fix Alignment */}
                  {index === 0 && (
                    <div className="absolute top-4 right-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        Live
                      </span>
                    </div>
                  )}

                  {/* Big Number with Theme Gradient */}
                  <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight group-hover:scale-110 transition-transform duration-300">
                    <span className="bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                      {stat.value}
                    </span>
                  </h3>

                  {/* Label */}
                  <p className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider text-xs mb-1">
                    {stat.label}
                  </p>
                  
                  {/* Subtext */}
                  <p className="text-slate-500 dark:text-slate-400 text-xs">
                    {stat.sub}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* --- HOW IT WORKS --- */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800/30">
        <div className="container mx-auto px-6 md:px-20 text-center">
          <div className="mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase text-xs bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">Workflow</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-4">From Report to Resolution</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-slate-700 -z-10 transform -translate-y-1/2 scale-x-75"></div>
            {[
              { icon: <FiCamera />, title: "1. Report Issue", desc: "Take a photo, auto-detect location, and submit details in seconds." },
              { icon: <FiCpu />, title: "2. Auto-Allocate", desc: "Our AI system automatically assigns the nearest available wireman." },
              { icon: <FiCheckCircle />, title: "3. Get Resolved", desc: "Track status in real-time and get notified once the issue is fixed." },
            ].map((step, i) => (
              <div key={i} className="relative p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 shadow-lg shadow-gray-200/50 dark:shadow-none">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-2xl text-emerald-600 dark:text-emerald-400 border-4 border-white dark:border-slate-800">
                  {step.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <section className="py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full"></div>
        </div>
        <div className="relative z-10 container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight">Ready to fix your city?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 text-lg">Join thousands of proactive citizens contributing to a smarter, safer environment today.</p>
            <button onClick={() => navigate("/login")} className="px-10 py-4 rounded-full font-bold text-lg bg-slate-900 dark:bg-emerald-500 text-white shadow-xl hover:scale-105 transition-all">Start Reporting Now</button>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-8 border-t border-gray-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900">
        <p className="text-gray-500 dark:text-gray-500 text-sm">© 2025 Smart E-Seva — Powered by LJ University Students.</p>
      </footer>
    </div>
  );
};

export default Home;