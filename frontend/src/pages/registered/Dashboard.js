// src/pages/registered/Dashboard.js

import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

import {
  FiFileText,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiActivity,
} from "react-icons/fi";

const API_BASE_URL = 'http://localhost:8080/api/v1';


// --- Verification Code Display Component (Modal) ---
const VerificationCodeModal = ({ code, ticketId, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Verification Code for ${ticketId} ${verificationCode
}`}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Please share this 6-digit code with the visiting agent to confirm resolution.</p>
                <h1 style={{ color: '#28a745', fontSize: '3em', border: '2px dashed #28a745', padding: '10px', borderRadius: '5px' }}>
                    {code}
                </h1>
                <p style={{ fontSize: '0.9em', color: 'red' }}>DO NOT share this code before the service is complete.</p>
                <button onClick={onClose} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
                    Close
                </button>
            </div>
        </Modal>
    );
};


const Dashboard = () => {
  const { auth } = useContext(AuthContext);

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const [verificationCode, setVerificationCode] = useState(null);
  const [complaintToVerify, setComplaintToVerify] = useState(null);
  const [sseStatus, setSseStatus] = useState("CONNECTING");

  // Fetch Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${auth.token}` } };
        const response = await axios.get(
          `${API_BASE_URL}/users/my-complaints`,
          config
        );

        if (Array.isArray(response.data)) {
          setComplaints(response.data);
        } else {
          setComplaints([]);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [auth]);

  // SSE Connection
  useEffect(() => {
    if (!auth.email || !auth.token) return;

    setSseStatus("CONNECTING");
    const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;

    let eventSource = new EventSource(sseUrl);

    eventSource.onopen = () => setSseStatus("CONNECTED");

    eventSource.addEventListener("verification_code", (event) => {
      const data = JSON.parse(event.data);
      setVerificationCode(data.verificationCode);
      setComplaintToVerify(data.ticketId);
      toast.success(
        `Verification code received for ${data.ticketId}, ${data.verificationCode}`
      );
    });

    eventSource.onerror = () => {
      setSseStatus("DISCONNECTED");
      eventSource.close();
    };

    return () => eventSource.close();
  }, [auth.email, auth.token]);

  if (loading) {
    return (
      <div className="pt-40 text-center text-gray-600 dark:text-gray-400">
        Loading your complaints...
      </div>
    );
  }

  // Summary
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(
    (c) => c.status === "In-Progress"
  ).length;
  const resolvedCount = complaints.filter((c) => c.status === "Resolved")
    .length;

  const summaryData = [
    {
      title: "Total Complaints",
      count: totalCount,
      icon: <FiFileText />,
      color: "emerald",
    },
    {
      title: "In Progress",
      count: inProgressCount,
      icon: <FiClock />,
      color: "blue",
    },
    {
      title: "Resolved",
      count: resolvedCount,
      icon: <FiCheckCircle />,
      color: "yellow",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-all duration-300">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="pt-28 pb-20 relative px-6 md:px-16">
        {/* Glow Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-[650px] h-[350px] bg-emerald-500/20 dark:bg-emerald-500/40 blur-[150px]"></div>
        </div>

        <div className="relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white"
          >
            Welcome back, {auth.name || "Citizen"} 👋
          </motion.h1>

          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Here's an overview of your complaint activity & updates.
          </p>

          {/* SSE Status Badge */}
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-sm 
            border shadow-sm
            bg-white dark:bg-slate-800 
            text-gray-700 dark:text-gray-300
            border-gray-200 dark:border-slate-700">

            <FiActivity className="mr-2" />
            Real-time Status:
            <span
              className={`ml-2 font-bold ${
                sseStatus === "CONNECTED"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-red-500"
              }`}
            >
              {sseStatus}
            </span>
          </div>
        </div>
      </section>

      {/* ---------------- SUMMARY CARDS ---------------- */}
      <section className="px-6 md:px-16 pb-16">
        <div className="grid md:grid-cols-3 gap-6">
          {summaryData.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="p-8 rounded-3xl bg-white dark:bg-[#0D1220]/70 backdrop-blur-xl 
                border border-gray-200 dark:border-slate-700/60 
                shadow-lg dark:shadow-[0_0_25px_rgba(0,255,150,0.15)]
                hover:-translate-y-1 transition"
            >
              <div
                className={`text-3xl mb-4 text-${card.color}-500 dark:text-${card.color}-400`}
              >
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-4xl font-extrabold mt-1 text-slate-900 dark:text-white">
                {card.count}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------------- COMPLAINT LIST ---------------- */}
      <section className="px-6 md:px-16 pb-28">
        <div className="rounded-3xl bg-white dark:bg-[#0D1220]/70 p-8 backdrop-blur-xl border border-gray-200 dark:border-slate-700/60 shadow-lg">

          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Recent Complaints
          </h2>

          {complaints.length === 0 ? (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400">
              You haven't raised any complaints yet.
            </div>
          ) : (
            <div className="space-y-6">
              {complaints.map((c) => (
                <motion.div
                  key={c.ticketId}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 flex justify-between items-center shadow-sm hover:shadow-lg transition"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">
                      {c.category}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {c.ticketId}
                    </p>
                  </div>

                  <div className="text-gray-600 dark:text-gray-400">
                    {c.dateRaised}
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold
                      ${
                        c.status === "Resolved"
                          ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-700/20 dark:text-emerald-400"
                          : c.status === "In-Progress"
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-700/20 dark:text-blue-400"
                          : "bg-yellow-100 text-yellow-600 dark:bg-yellow-700/20 dark:text-yellow-400"
                      }
                  `}
                  >
                    {c.status}
                  </span>

                  <Link
                    to={`/complaint/${c.ticketId}`}
                    className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  >
                    View
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
