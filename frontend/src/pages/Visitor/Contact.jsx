// src/pages/visitor/Contact.js
import React from "react";
import { motion } from "framer-motion";
import { FiPhone, FiMessageSquare, FiMail, FiUser } from "react-icons/fi";
// ADD THESE IMPORTS AT THE TOP
import { FaWhatsapp, FaTelegramPlane, FaTwitter, FaInstagram } from "react-icons/fa";


const Contact = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300 overflow-hidden">

      {/* --- HERO SECTION --- */}
      <section className="pt-28 pb-16 text-center relative px-6">
        {/* Background Glow */}
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
          Get In <span className="text-emerald-500">Touch</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
        >
          We're here to help you. Send us a message or reach out using the contact details below.
        </motion.p>
      </section>

      {/* --- CONTENT SECTION --- */}
      <section className="px-6 md:px-20 pb-20">
        <div className="grid md:grid-cols-2 gap-12">

          {/* --- FORM CARD --- */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              bg-white dark:bg-[#0D1220]/70 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/60 
              rounded-3xl shadow-xl 
              dark:shadow-[0_0_30px_rgba(0,255,150,0.08)]
              p-8
            "
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Send us a Message
            </h3>

            <form className="flex flex-col gap-5">
              
              {/* Name */}
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700">
                <FiUser className="text-gray-500 dark:text-gray-400 text-xl" />
                <input
                  type="text"
                  placeholder="Your Name"
                  className="bg-transparent flex-1 outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Email */}
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-slate-800 px-4 py-3 rounded-xl border border-gray-300 dark:border-slate-700">
                <FiMail className="text-gray-500 dark:text-gray-400 text-xl" />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="bg-transparent flex-1 outline-none text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Message */}
              <textarea
                placeholder="Your Message..."
                rows="6"
                className="
                  bg-gray-100 dark:bg-slate-800 
                  px-4 py-3 rounded-xl 
                  border border-gray-300 dark:border-slate-700
                  outline-none text-slate-900 dark:text-white
                "
                required
              ></textarea>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="
                  w-full px-8 py-4 rounded-xl 
                  font-semibold text-white text-lg 
                  bg-emerald-600 hover:bg-emerald-500
                  dark:bg-emerald-500 dark:text-slate-900 
                  shadow-md hover:shadow-xl transition-all
                "
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* --- CONTACT INFO CARD --- */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              bg-white dark:bg-[#0D1220]/70 
              backdrop-blur-xl 
              border border-gray-200 dark:border-slate-700/60 
              rounded-3xl shadow-xl 
              dark:shadow-[0_0_30px_rgba(0,255,150,0.08)]
              p-8 h-fit
            "
          >
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Contact Information
            </h3>

            {/* Emergency Section */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-2xl shadow-inner">
                <FiPhone />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-slate-900 dark:text-white">Emergency Helplines</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Electricity Board: 1912</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Water Supply: 1800-425-1333</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-3 mt-3">

  {/* WhatsApp */}
  <a
    href="#"
    className="
      flex items-center gap-2 px-4 py-2 rounded-full text-sm
      bg-gray-100 dark:bg-slate-800
      text-slate-700 dark:text-gray-300
      border border-gray-300 dark:border-slate-700
      hover:bg-green-100 dark:hover:bg-green-900/30
      hover:text-green-600 dark:hover:text-green-400
      transition-all
    "
  >
    <FaWhatsapp className="text-lg" />
    WhatsApp
  </a>

  {/* Telegram */}
  <a
    href="#"
    className="
      flex items-center gap-2 px-4 py-2 rounded-full text-sm
      bg-gray-100 dark:bg-slate-800
      text-slate-700 dark:text-gray-300
      border border-gray-300 dark:border-slate-700
      hover:bg-blue-100 dark:hover:bg-blue-900/30
      hover:text-blue-600 dark:hover:text-blue-400
      transition-all
    "
  >
    <FaTelegramPlane className="text-lg" />
    Telegram
  </a>

  {/* Twitter/X */}
  <a
    href="#"
    className="
      flex items-center gap-2 px-4 py-2 rounded-full text-sm
      bg-gray-100 dark:bg-slate-800
      text-slate-700 dark:text-gray-300
      border border-gray-300 dark:border-slate-700
      hover:bg-black/10 dark:hover:bg-white/10
      hover:text-black dark:hover:text-white
      transition-all
    "
  >
    <FaTwitter className="text-lg" />
    Twitter
  </a>

  {/* Instagram */}
  <a
    href="#"
    className="
      flex items-center gap-2 px-4 py-2 rounded-full text-sm
      bg-gray-100 dark:bg-slate-800
      text-slate-700 dark:text-gray-300
      border border-gray-300 dark:border-slate-700
      hover:bg-pink-100 dark:hover:bg-pink-900/30
      hover:text-pink-600 dark:hover:text-pink-400
      transition-all
    "
  >
    <FaInstagram className="text-lg" />
    Instagram
  </a>

</div>

          </motion.div>

        </div>
      </section>
    </div>
  );
};

export default Contact;
