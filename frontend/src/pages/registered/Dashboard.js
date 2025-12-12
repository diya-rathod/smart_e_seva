// src/pages/registered/Dashboard.js

import React, { useState, useEffect, useContext, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
  Activity,
  FileText,
  Clock,
  CheckCircle2,
  Plus,
  ClipboardList,
  Search,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import KpiCard from "../../components/ui/dashboard/KpiCard";
import QuickActionButton from "../../components/ui/dashboard/QuickActionButton";
import StatusChip from "../../components/ui/dashboard/StatusChip";
import ActivityItem from "../../components/ui/dashboard/ActivityItem";
import {
  sectionTitleClass,
  cardTitleClass,
  bodyTextClass,
  mutedLabelClass,
} from "../../styles/dashboardTypography";

const API_BASE_URL = "http://localhost:8080/api/v1";

const getStatusIcon = (status) => {
  if (status === "Resolved")
    return <CheckCircle2 className="h-5 w-5 text-emerald-500" strokeWidth={1.5} />;
  if (status === "In-Progress")
    return <Activity className="h-5 w-5 text-sky-500" strokeWidth={1.5} />;
  return <AlertTriangle className="h-5 w-5 text-amber-500" strokeWidth={1.5} />;
};

const formatTimestamp = (value) => {
  if (!value) return "Just now";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "numeric",
    month: "short",
  });
};

const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const { theme } = useTheme();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sseStatus, setSseStatus] = useState("CONNECTING");

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${auth.token}` },
        };
        const response = await axios.get(`${API_BASE_URL}/users/my-complaints`, config);
        setComplaints(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching complaints:", error);
        toast.error("Could not load your complaints right now.");
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [auth]);

  useEffect(() => {
    if (!auth?.token || !auth?.email) return;

    setSseStatus("CONNECTING");
    const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
    const botchedSource = new EventSource(sseUrl);

    botchedSource.onopen = () => setSseStatus("CONNECTED");
    botchedSource.onerror = () => {
      setSseStatus("DISCONNECTED");
      botchedSource.close();
    };

    botchedSource.addEventListener("verification_code", (event) => {
      const data = JSON.parse(event.data);
      toast.success(`Verification code ready for ${data.ticketId}.`);
    });

    return () => botchedSource.close();
  }, [auth]);

  const totalCount = complaints.length;
  const inProgressCount = complaints.filter((c) => c.status === "In-Progress").length;
  const resolvedComplaints = complaints.filter((c) => c.status === "Resolved");
  const resolvedCount = resolvedComplaints.length;

  const totalResolutionMinutes = resolvedComplaints.reduce(
    (acc, complaint) => acc + (complaint.resolutionMinutes ?? 210),
    0
  );
  const averageResolutionMinutes = resolvedCount
    ? Math.round(totalResolutionMinutes / resolvedCount)
    : 0;
  const averageResolutionTime = resolvedCount
    ? `${Math.floor(averageResolutionMinutes / 60)}h ${averageResolutionMinutes % 60}m`
    : "Awaiting Data";

  const heroStatusLabel =
    sseStatus === "CONNECTED" ? "Connected" : sseStatus === "CONNECTING" ? "Connecting" : "Offline";

  const kpis = [
    {
      title: "Total Complaints",
      value: totalCount || 0,
      icon: <FileText className="h-5 w-5" strokeWidth={2} />,
      meta: "all time",
    },
    {
      title: "Active Tickets",
      value: inProgressCount,
      icon: <Activity className="h-5 w-5" strokeWidth={2} />,
      meta: "currently open",
    },
    {
      title: "Resolved",
      value: resolvedCount,
      icon: <CheckCircle2 className="h-5 w-5" strokeWidth={2} />,
      meta: "completed",
    },
    {
      title: "Avg. Resolution",
      value: averageResolutionTime,
      icon: <Clock className="h-5 w-5" strokeWidth={2} />,
      meta: "live average",
    },
  ];

  const activityFeed = useMemo(() => {
    const buffer = complaints
      .map((complaint) => {
        const rawTimestamp =
          complaint.updatedAt ||
          complaint.modifiedAt ||
          complaint.createdAt ||
          complaint.dateRaised ||
          new Date().toISOString();
        const description = `Ticket ${complaint.ticketId} moved to ${complaint.status || "New"}.`;
        return {
          id: `${complaint.ticketId}-${rawTimestamp}`,
          timestamp: formatTimestamp(rawTimestamp),
          rawTimestamp,
          title: complaint.category || "Service update",
          description,
          icon: getStatusIcon(complaint.status),
        };
      })
      .sort((a, b) => new Date(b.rawTimestamp) - new Date(a.rawTimestamp));

    return buffer.slice(0, 5);
  }, [complaints]);

  const visibleActivityFeed = activityFeed.slice(0, 4);

  const getCategoryIcon = (category) => {
    if (!category) return <AlertTriangle className="h-5 w-5 text-slate-500" strokeWidth={1.2} />;
    if (category.toLowerCase().includes("water"))
      return <MapPin className="h-5 w-5 text-sky-500" strokeWidth={1.2} />;
    if (category.toLowerCase().includes("electric"))
      return <Activity className="h-5 w-5 text-amber-500" strokeWidth={1.2} />;
    if (category.toLowerCase().includes("garbage") || category.toLowerCase().includes("waste"))
      return <ClipboardList className="h-5 w-5 text-emerald-500" strokeWidth={1.2} />;
    return <AlertTriangle className="h-5 w-5 text-slate-500" strokeWidth={1.2} />;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center py-24 text-center text-slate-600 dark:text-slate-300">
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 dark:bg-slate-950 dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[1260px] flex-col gap-6">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-black/5 bg-gradient-to-br from-slate-50 to-slate-100 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-gradient-to-br dark:from-slate-900/80 dark:to-slate-900/60"
        >
          <p className={`${cardTitleClass}`}>Citizen dashboard</p>
          <h1 className={`mt-2 ${sectionTitleClass}`}>Welcome back, Citizen 👋</h1>
          <p className={`mt-2 ${bodyTextClass}`}>Here's an overview of your activity & updates.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span
              className={`flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 ${mutedLabelClass} dark:border-white/10 dark:bg-white/5`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  heroStatusLabel === "Connected" ? "bg-emerald-500" : "bg-amber-400"
                }`}
              />
              Status: {heroStatusLabel}
            </span>
            <span className={mutedLabelClass}>Synchronized with visitor UI</span>
          </div>
        </motion.section>

        <section className="grid grid-cols-12 gap-6">
          {kpis.map((card) => (
            <div key={card.title} className="col-span-12 md:col-span-6 xl:col-span-3">
              <KpiCard title={card.title} value={card.value} icon={card.icon} meta={card.meta} />
            </div>
          ))}
        </section>

        <section className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className={cardTitleClass}>Quick actions</p>
            <p className={mutedLabelClass}>Touch-ready</p>
          </div>
          <h2 className={`mt-2 ${sectionTitleClass}`}>Start a new request</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <QuickActionButton
              label="Raise Complaint"
              icon={<Plus className="h-5 w-5" strokeWidth={2} />}
              onClick={() => navigate("/raise-complaint")}
            />
            <QuickActionButton
              label="View Complaints"
              icon={<ClipboardList className="h-5 w-5" strokeWidth={2} />}
              onClick={() => navigate("/dashboard")}
              variant="ghost"
            />
            <QuickActionButton
              label="Track Status"
              icon={<Search className="h-5 w-5" strokeWidth={2} />}
              onClick={() => navigate("/track-complaint")}
              variant="ghost"
            />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-black/5 bg-white/80 p-6 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 min-h-[360px] lg:min-h-[460px]">
              <div className="flex items-center justify-between">
                <div>
                  <p className={cardTitleClass}>Recent complaints</p>
                  <h3 className={`mt-1 ${sectionTitleClass}`}>Complaint tracker</h3>
                </div>
                <span className={mutedLabelClass}>{totalCount} total</span>
              </div>
              <div className="space-y-3">
                {complaints.slice(0, 6).map((complaint) => (
                  <motion.div
                    key={complaint.ticketId}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-12 items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 text-sm shadow-[0_2px_10px_rgba(0,0,0,0.06)] transition duration-200 dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="col-span-12 flex items-center gap-3 sm:col-span-5">
                      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900/5 text-emerald-500 dark:border-white/5">
                        {getCategoryIcon(complaint.category)}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {complaint.category || "General request"}
                        </p>
                        <p className={`${mutedLabelClass}`}>{complaint.ticketId}</p>
                      </div>
                    </div>
                    <div className="col-span-6 text-sm text-slate-500 dark:text-slate-400 sm:col-span-3">
                      {complaint.dateRaised || "No date"}
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                      <StatusChip status={complaint.status || "New"} />
                    </div>
                    <div className="col-span-12 flex justify-end sm:col-span-2">
                      <Link
                        to={`/complaint/${complaint.ticketId}`}
                        aria-label={`View complaint ${complaint.ticketId}`}
                        className="rounded-full border border-transparent bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        View
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <div className="flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white/80 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 min-h-[220px]">
              <div>
                <p className={cardTitleClass}>Activity</p>
                <h3 className={`mt-1 ${sectionTitleClass}`}>Recent activity</h3>
              </div>
              <div className="mt-4 space-y-3">
                {activityFeed.length === 0 ? (
                  <p className={bodyTextClass}>No updates yet.</p>
                ) : (
                  activityFeed.map((activity) => (
                    <ActivityItem
                      key={activity.id}
                      icon={activity.icon}
                      title={activity.title}
                      description={activity.description}
                      timestamp={activity.timestamp}
                    />
                  ))
                )}
              </div>
            </div>

            <div className="flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white/80 p-4 shadow-[0_2px_10px_rgba(0,0,0,0.06)] dark:border-white/10 dark:bg-white/5 min-h-[220px]">
              <div>
                <p className={cardTitleClass}>Map preview</p>
                <h3 className={`mt-1 ${sectionTitleClass}`}>Complaint footprint</h3>
              </div>
              <div className="mt-4 flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-slate-100 px-4 py-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex gap-2">
                  <span className="h-1.5 w-8 rounded-full bg-slate-300 dark:bg-slate-400" />
                  <span className="h-1.5 w-16 rounded-full bg-slate-300 dark:bg-slate-400" />
                  <span className="h-1.5 w-12 rounded-full bg-slate-300 dark:bg-slate-400" />
                </div>
                <p className={mutedLabelClass}>Soft location mesh</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
