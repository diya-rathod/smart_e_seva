import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock3,
  Droplet,
  Image,
  Loader2,
  MapPin,
  Search,
  Send,
  User2,
} from "lucide-react";
import { sectionTitleClass } from "../../styles/dashboardTypography";

const complaintRecord = {
  id: "CMP-11204",
  title: "Water leakage near Sector 12 transformer",
  category: "Water Leakage",
  status: "In Progress",
  ticketId: "WAT-2048",
  submittedAt: "2025-12-10T08:20:00Z",
  lastUpdated: "2025-12-12T10:15:00Z",
  agent: { name: "Neha Kapoor", phone: "+91 98765 43210" },
  location: "Sector 12, civic center parking",
  coordinates: { lat: 27.7102, lng: 85.3157 },
  insight: "Pressure has been restored on the main line. Crew is replacing the worn segment today.",
  predictedResolution: "Dec 14, 2025 · 4:00 PM",
  attachments: ["leakage-1.jpg", "leakage-2.jpg"],
};

const timelineSteps = [
  {
    key: "Submitted",
    title: "Submitted",
    description: "The complaint was logged with full details + photos.",
    timestamp: "Dec 10 · 08:20 AM",
    status: "completed",
  },
  {
    key: "Assigned",
    title: "Agent assigned",
    description: "Field engineer Neha was dispatched for inspection.",
    timestamp: "Dec 10 · 09:35 AM",
    status: "completed",
  },
  {
    key: "In Progress",
    title: "Work in progress",
    description: "Crew is securing the area and replacing the faulty pipe.",
    timestamp: "Dec 12 · 10:15 AM",
    status: "current",
  },
  {
    key: "Resolved",
    title: "Resolved",
    description: "Final check will be done once pressure is stabilized.",
    timestamp: "Awaiting",
    status: "pending",
  },
];

const statusStyles = {
  New: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-green-100 text-green-600",
};

const TrackComplaint = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [queriedId, setQueriedId] = useState(complaintRecord.ticketId);

  const handleTrack = (event) => {
    event.preventDefault();
    if (!searchTerm) return;
    setIsSearching(true);
    setTimeout(() => {
      setQueriedId(searchTerm);
      setIsSearching(false);
    }, 900);
  };

  const timelineState = useMemo(() => {
    const currentIndex = timelineSteps.findIndex((step) => step.status === "current");
    return timelineSteps.map((step, index) => {
      const state =
        step.status === "completed"
          ? "completed"
          : index === currentIndex
          ? "current"
          : "pending";
      return { ...step, state };
    });
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col gap-6 bg-slate-50 px-4 py-10 dark:bg-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Citizen Panel</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Track Complaint</h1>
          <p className="text-sm leading-[1.5] text-slate-500 dark:text-slate-400">
            Check live updates and progress for your complaint. Use the complaint ID to jump straight to the latest
            notes, attachments, and timeline.
          </p>
        </header>

        <form
          onSubmit={handleTrack}
          className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Enter Complaint ID…"
                className="w-full rounded-xl border border-gray-200 bg-white/70 px-12 py-3 text-sm leading-[1.4] tracking-normal placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-white/10 dark:bg-white/5 dark:placeholder:text-white/40"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-emerald-500 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-emerald-400"
              disabled={isSearching || !searchTerm}
            >
              {isSearching ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Tracking…
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Track Status
                </>
              )}
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500 dark:text-gray-400">
            Last tracked ID: <span className="font-semibold text-slate-900 dark:text-white">{queriedId}</span>
          </p>
        </form>

        <section className="space-y-6">
          <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_15px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <Droplet className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-medium tracking-tight text-slate-900 dark:text-white">{complaintRecord.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{complaintRecord.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[complaintRecord.status]} transition hover:brightness-95`}
                >
                  {complaintRecord.status}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-500">{complaintRecord.insight}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="space-y-2 rounded-2xl border border-gray-200/50 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Complaint ID</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaintRecord.ticketId}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Submitted at {new Date(complaintRecord.submittedAt).toLocaleString()}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-gray-200/50 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/5">
                <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Last updated</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{new Date(complaintRecord.lastUpdated).toLocaleString()}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Assigned to {complaintRecord.agent.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{complaintRecord.agent.phone}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-slate-800 shadow-sm dark:border-emerald-400/60 dark:bg-emerald-500/10 dark:text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">Smart insight</p>
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{complaintRecord.predictedResolution}</p>
                  <p className="text-xs text-slate-700 dark:text-slate-200">{complaintRecord.insight}</p>
                </div>
                <Clock3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4 rounded-2xl border border-gray-200/60 bg-white/90 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.12)] dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-base font-semibold text-slate-900 dark:text-white">Progress timeline</p>
            <div className="relative space-y-6">
              <span className="absolute left-5 top-2 bottom-2 w-[2px] bg-slate-200 dark:bg-slate-700"></span>
              {timelineState.map((step) => (
                <div key={step.key} className="flex items-start gap-3 pl-10">
                  <span
                    className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                      step.state === "completed"
                        ? "border-emerald-400 bg-emerald-50 text-emerald-600 shadow"
                        : step.state === "current"
                        ? "border-blue-400 bg-blue-50 text-blue-600 shadow"
                        : "border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/5"
                    }`}
                  >
                    {step.state === "completed" ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : step.state === "current" ? (
                      <Send className="h-4 w-4" />
                    ) : (
                      <User2 className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium tracking-tight text-slate-900 dark:text-white">{step.title}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{step.description}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500">{step.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
              <p className="text-base font-semibold text-slate-900 dark:text-white">Attachments</p>
              <div className="mt-4 flex gap-3">
                {complaintRecord.attachments.map((attachment) => (
                  <div
                    key={attachment}
                    className="flex h-24 w-24 flex-col items-center justify-center rounded-2xl border border-gray-200/60 bg-slate-50 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-400"
                  >
                    <Image className="h-5 w-5" />
                    <span className="mt-1">{attachment}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200/60 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5">
              <p className="text-base font-semibold text-slate-900 dark:text-white">Mini map</p>
              <div className="mt-4 h-40 w-full rounded-2xl border border-dashed border-gray-200 bg-slate-100 dark:border-white/10 dark:bg-white/10"></div>
              <div className="mt-4 space-y-1 text-sm text-slate-600 dark:text-gray-300">
                <p className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-emerald-500" />
                  {complaintRecord.location}
                </p>
                <p>Lat {complaintRecord.coordinates.lat.toFixed(4)}, Lng {complaintRecord.coordinates.lng.toFixed(4)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackComplaint;

