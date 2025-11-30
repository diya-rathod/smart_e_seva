// src/pages/visitor/About.js
import React from "react";
import { motion } from "framer-motion";
import {
  FiTarget,
  FiEye,
  FiZap,
  FiUsers,
  FiGlobe,
  FiHeart,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";



const About = () => {
  // Component ke andar
const navigate = useNavigate();

  const features = [
    {
      icon: <FiTarget />,
      title: "Our Goal",
      desc: "To create a transparent and efficient bridge between citizens and authorities, ensuring every civic issue gets resolved faster and smarter.",
      color: "text-emerald-500",
      glow: "group-hover:shadow-emerald-500/30",
    },
    {
      icon: <FiEye />,
      title: "Our Vision",
      desc: "We envision a future where every citizen contributes to civic improvement effortlessly through smart technology and connected systems.",
      color: "text-blue-500",
      glow: "group-hover:shadow-blue-500/30",
    },
    {
      icon: <FiZap />,
      title: "Our Focus",
      desc: "Starting with critical services like electricity and water, we aim to expand Smart E-Seva to all aspects of city management.",
      color: "text-amber-500",
      glow: "group-hover:shadow-amber-500/30",
    },
  ];

  const stats = [
    { value: "25K+", label: "Active Citizens" },
    { value: "1.5L+", label: "Issues Reported" },
    { value: "98%", label: "Resolution Rate" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300 overflow-hidden">
      {/* --- Hero Section --- */}
      <section className="relative pt-28 pb-20 px-6 md:px-20 text-center">
        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[30%] w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/20 rounded-full blur-[120px]"></div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6"
        >
          Powering <span className="text-emerald-500">Better Communities</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
        >
          Smart E-Seva connects citizens and authorities through innovation,
          technology, and accountability — making civic service management
          faster, transparent, and citizen-first.
        </motion.p>
      </section>

      {/* --- Mission Statement --- */}
      <section className="py-12 md:py-20 bg-white dark:bg-slate-800/40">
        <div className="container mx-auto px-6 md:px-20 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg">
              We’re on a mission to make urban life more connected and efficient.
              Smart E-Seva enables citizens to report issues and track resolutions
              in real time, empowering everyone to take part in building better
              cities.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <span className="px-4 py-2 rounded-full text-sm bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold">
                Transparency
              </span>
              <span className="px-4 py-2 rounded-full text-sm bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold">
                Accountability
              </span>
              <span className="px-4 py-2 rounded-full text-sm bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold">
                Citizen Empowerment
              </span>
            </div>
          </motion.div>

          {/* Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="flex justify-center"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/5539/5539431.png"
              alt="Mission Illustration"
              className="w-[350px] md:w-[400px] rounded-2xl shadow-xl dark:shadow-emerald-500/10"
            />
          </motion.div>
        </div>
      </section>

      {/* --- Core Values --- */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6 md:px-20 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-14"
          >
            Our Core Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`group p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 hover:shadow-lg transition-all ${item.glow}`}
              >
                <div
                  className={`text-4xl mb-5 ${item.color} flex justify-center`}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- Stats Banner --- */}
      <section className="py-16 bg-emerald-500/5 dark:bg-emerald-900/10 border-y border-gray-200 dark:border-slate-800">
        <div className="container mx-auto px-6 md:px-20 grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="text-4xl font-extrabold text-emerald-600 dark:text-amber-400">
                {stat.value}
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- Closing CTA --- */}
      <section className="py-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
        >
          Together, We Light the Future
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10"
        >
          Every report strengthens our mission. Every citizen matters. Join the
          revolution to make civic life seamless and impactful.
        </motion.p>

        <motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  onClick={() => navigate('/login')}
  className="px-10 py-4 rounded-full font-bold text-lg bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-900 shadow-xl hover:scale-105 transition-all"
>
  Get Involved
</motion.button>

      </section>
    </div>
  );
};

export default About;
