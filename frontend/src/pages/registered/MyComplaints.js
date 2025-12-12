import { useMemo, useState } from "react";
import {
  Activity,
  Droplet,
  Flashlight,
  Hammer,
  MapPin,
  Search,
  Trash2,
  X,
} from "lucide-react";

const complaintsData = [
  {
    id: "CMP-11204",
    title: "Water leakage near Sector 12 transformer",
    category: "Water Leakage",
    status: "In Progress",
    submittedAt: "2025-12-01T09:23:00Z",
    eta: "Crew notified, ETA 2 hrs",
    ticketId: "WAT-2048",
    description:
      "Water is pooling next to the transformer and running into the basement of Block B's parking area. Risk of equipment shorting.",
    location: "Sector 12, near civic center parking",
    coords: { lat: 27.7102, lng: 85.3157 },
    agent: { name: "Neha Kapoor", phone: "+91 98765 43210" },
    photos: ["leakage-1.jpg", "leakage-2.jpg"],
  },
  {
    id: "CMP-11205",
    title: "Street light fault on Block D avenue",
    category: "Street Light",
    status: "Resolved",
    submittedAt: "2025-11-28T21:10:00Z",
    eta: "Work completed",
    ticketId: "STR-3342",
    description:
      "Multiple poles between Block D and E have flickering lights that fail after 11PM. Neighbors are requesting a safety check.",
    location: "Block D Avenue, near community market",
    coords: { lat: 27.7115, lng: 85.3104 },
    agent: { name: "Arjun Mehta", phone: "+91 98123 00987" },
    photos: ["street-light.jpg"],
  },
  {
    id: "CMP-11206",
    title: "Garbage pile-up behind central park",
    category: "Waste",
    status: "New",
    submittedAt: "2025-12-10T14:48:00Z",
    eta: "Pending assignment",
    ticketId: "WST-4010",
    description:
      "Overflowing bins attract stray animals and block the footpath for evening walkers. Requesting a pickup and sanitization.",
    location: "Behind central park playground",
    coords: { lat: 27.7090, lng: 85.3172 },
    agent: { name: "Pending", phone: "-" },
    photos: [],
  },
];

const categoryMeta = {
  "Water Leakage": { Icon: Droplet, color: "bg-emerald-100 text-emerald-600" },
  "Street Light": { Icon: Flashlight, color: "bg-amber-100 text-amber-600" },
  Waste: { Icon: Trash2, color: "bg-sky-100 text-sky-600" },
};

const statusStyles = {
  New: "bg-yellow-100 text-yellow-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-600",
};

const timelineSteps = [
  { label: "Submitted", key: "Submitted" },
  { label: "Assigned", key: "Assigned" },
  { label: "In Progress", key: "In Progress" },
  { label: "Resolved", key: "Resolved" },
];

const MyComplaints = () => {
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(null);

  const filteredComplaints = useMemo(() => {
    return complaintsData.filter((complaint) => {
      if (filter !== "All" && complaint.status !== filter) {
        return false;
      }
      if (!searchTerm) return true;
      const query = searchTerm.toLowerCase();
      return (
        complaint.title.toLowerCase().includes(query) ||
        complaint.description.toLowerCase().includes(query) ||
        complaint.location.toLowerCase().includes(query) ||
        complaint.ticketId.toLowerCase().includes(query)
      );
    });
  }, [filter, searchTerm]);

  return (
    <div className="min-h-screen w-full bg-slate-50 py-12 dark:bg-slate-950">
      <div className="w-full space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Citizen dashboard</p>
          <h1 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">My Complaints</h1>
          <p className="text-sm leading-[1.4] text-slate-500 dark:text-slate-400">
            Keep track of every request with live timelines, notes from technicians, and quick access to all documentation.
          </p>
        </header>

        <div className="rounded-2xl border border-black/5 bg-white/80 p-6 shadow-[0_15px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex flex-wrap gap-2">
              {["All", "New", "In Progress", "Resolved"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${filter === item ? "bg-emerald-600 text-white shadow-sm" : "border border-gray-200 text-slate-700 hover:border-emerald-300"}`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by title, ID, location…"
                className="w-full rounded-xl border border-gray-200 bg-white px-10 py-3 text-sm tracking-normal placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 dark:border-white/10 dark:bg-white/5 dark:text-white dark:placeholder:text-white/40"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-xs text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {filteredComplaints.map((complaint) => {
              const isExpanded = expanded === complaint.id;
              const { Icon, color } = categoryMeta[complaint.category] || {
                Icon: Activity,
                color: "bg-slate-100 text-slate-600",
              };
              return (
                <div key={complaint.id} className="space-y-2">
                  <div
                    onClick={() => setExpanded(isExpanded ? null : complaint.id)}
                    className={`flex cursor-pointer flex-col gap-4 rounded-xl border border-gray-200/50 bg-white/80 p-5 shadow-sm transition duration-200 ${isExpanded ? "shadow-md" : "hover:-translate-y-0.5 hover:shadow-md"} dark:border-white/10 dark:bg-white/5`}
                    aria-expanded={isExpanded}
                  >
                    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                      <div className="flex items-center gap-4">
                        <span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${color}`}>
                          <Icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-base font-medium tracking-tight text-slate-900 dark:text-white">{complaint.title}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-300">{complaint.description}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                            <span>{new Date(complaint.submittedAt).toLocaleString()}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {complaint.ticketId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start justify-between gap-4 md:flex-col md:items-end">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[complaint.status]} transition hover:brightness-95`}
                        >
                          {complaint.status}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">{complaint.eta}</span>
                        <span className="text-slate-400 transition group-hover:text-slate-600 dark:text-slate-500">
                          {!isExpanded ? "▾" : "▴"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`overflow-hidden rounded-xl border border-dashed border-gray-200/60 bg-slate-100/60 p-6 transition-all duration-300 dark:border-white/10 dark:bg-white/5 ${isExpanded ? "opacity-100" : "pointer-events-none opacity-0"}`}
                    style={{ maxHeight: isExpanded ? "740px" : "0px" }}
                  >
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold tracking-tight text-slate-700 dark:text-slate-200">Status timeline</p>
                        <div className="relative space-y-4 pl-6">
                          <span className="absolute left-1 top-1 bottom-1 w-[2px] bg-slate-300 dark:bg-slate-700"></span>
                          {timelineSteps.map((step, index) => {
                            const currentIndex = timelineSteps.findIndex((s) => s.key === complaint.status);
                            const isActive = index <= currentIndex;
                            return (
                              <div key={step.key} className="flex items-center gap-3">
                                <span
                                  className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${isActive ? "border-emerald-500 bg-emerald-500/20" : "border-slate-300 dark:border-white/20"}`}
                                >
                                  <span className={`h-2 w-2 rounded-full ${isActive ? "bg-emerald-600" : "bg-transparent"}`}></span>
                                </span>
                                <div>
                                  <p className="text-xs font-semibold tracking-tight text-slate-700 dark:text-slate-200">{step.label}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400">
                                    {isActive ? "Completed" : "Pending"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2 rounded-2xl border border-gray-200/50 bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                          <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Agent on the case</p>
                          <p className="font-medium text-slate-900 dark:text-white">{complaint.agent.name}</p>
                          <p>{complaint.agent.phone}</p>
                        </div>
                        <div className="space-y-2 rounded-2xl border border-gray-200/50 bg-white/80 p-4 text-sm text-slate-600 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-gray-300">
                          <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Submitted at</p>
                          <p>{new Date(complaint.submittedAt).toLocaleString()}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{complaint.location}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Coordinates: {complaint.coords.lat.toFixed(4)}, {complaint.coords.lng.toFixed(4)}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-gray-200/50 bg-white/80 p-4 shadow-sm dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Map preview</p>
                        <div className="mt-3 h-32 w-full rounded-xl border border-dashed border-slate-200 bg-slate-100 dark:border-white/10 dark:bg-white/10"></div>
                      </div>

                      {complaint.photos.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold tracking-tight text-slate-500 dark:text-slate-400">Photos</p>
                          <div className="flex gap-3">
                            {complaint.photos.map((photo) => (
                              <div
                                key={photo}
                                className="flex h-24 w-24 items-center justify-center rounded-2xl border border-gray-200/60 bg-white/80 text-xs text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5"
                              >
                                {photo}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComplaints;

