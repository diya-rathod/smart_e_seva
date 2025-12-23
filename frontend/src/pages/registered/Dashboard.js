// import React from 'react';
// import { Link } from 'react-router-dom';
// import './Dashboard.css';
// import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

// const summaryData = [
//   { title: 'Total Complaints', count: 3, icon: <FiFileText />, color: 'blue' },
//   { title: 'In Progress', count: 1, icon: <FiClock />, color: 'yellow' },
//   { title: 'Resolved', count: 2, icon: <FiCheckCircle />, color: 'green' },
// ];

// const dummyComplaints = [
//   { ticketId: 'TKT-001', category: 'Water Leakage', status: 'In Progress', dateRaised: '28 Sep, 2025' },
//   { ticketId: 'TKT-002', category: 'Street Light Not Working', status: 'Resolved', dateRaised: '25 Sep, 2025' },
//   { ticketId: 'TKT-003', category: 'Waste Management', status: 'New', dateRaised: '27 Sep, 2025' },
// ];

// const Dashboard = () => {
//   return (
//     <div className="page-content-card">
//       <div className="dashboard-header">
//         <h1>Welcome back, Diya!</h1>
        
//       </div>

//       <div className="summary-cards">
//         {/* ... Summary cards section remains the same ... */}
//         {summaryData.map((card, index) => (
//           <div className="summary-card" key={index}>
//             <div className={`summary-icon-wrapper icon-${card.color}`}>
//               {card.icon}
//             </div>
//             <div className="summary-info">
//               <span className="summary-title">{card.title}</span>
//               <span className="summary-count">{card.count}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="complaint-list-container">
//         <div className="complaint-list-header">
//           <h2>Recent Complaints</h2>
//           <div className="complaint-list-column-titles">
//             <span>Category / Ticket ID</span>
//             <span>Date Raised</span>
//             <span>Status</span>
//             <span>Action</span>
//           </div>
//         </div>

//         <div className="complaint-list">
//           {dummyComplaints.map((complaint) => (
//             <div className="complaint-item" key={complaint.ticketId}>
//               <div className="complaint-category">
//                 <span className="category-title">{complaint.category}</span>
//                 <span className="ticket-id">{complaint.ticketId}</span>
//               </div>
//               <div className="complaint-date">{complaint.dateRaised}</div>
//               <div className="complaint-status">
//                 <span className={`status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
//                   {complaint.status}
//                 </span>
//               </div>
//               <div className="complaint-action">
//                 <Link to="/complaint-details" className="details-link">View</Link>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;


import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { motion } from 'framer-motion';
import { 
  FiFileText, 
  FiClock, 
  FiCheckCircle, 
  FiPlusCircle,
  FiSearch,
  FiTrendingUp,
  FiMapPin
} from 'react-icons/fi';

// Import UI Components from index
import {
  KpiCard,
  StatusChip,
  ActivityItem,
  QuickActionButton,
  ComplaintCard
} from '../../components/ui/dashboard';

import './Dashboard.css';

// ⚠️ IMPORTANT: LIVE URL USE KARO, LOCALHOST NAHI
const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// --- 1. MODAL COMPONENT ---
const VerificationCodeModal = ({ code, ticketId, onClose }) => {
    return (
        <Modal isOpen={true} onClose={onClose} title={`Verification Code for ${ticketId}`}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Please share this 6-digit code with the visiting agent to confirm resolution.</p>
                <h1 style={{ color: '#28a745', fontSize: '3em', border: '2px dashed #28a745', padding: '10px', borderRadius: '5px', background: '#f9f9f9', margin: '20px 0' }}>
                    {code}
                </h1>
                <p style={{ fontSize: '0.9em', color: 'red', marginBottom: '20px' }}>
                    DO NOT share this code before the service is complete.
                </p>
                <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '1rem' }}>
                    Close Popup
                </button>
            </div>
        </Modal>
    );
};

// --- 2. MAIN DASHBOARD COMPONENT ---
const Dashboard = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [verificationCode, setVerificationCode] = useState(null);
  const [complaintToVerify, setComplaintToVerify] = useState(null);
  const [sseStatus, setSseStatus] = useState('CONNECTING'); 

  // --- A. Fetch Data ---
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!auth.token) { setLoading(false); return; }
      try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        const response = await axios.get(`${API_BASE_URL}/users/my-complaints`, config);

        if (Array.isArray(response.data)) {
          setComplaints(response.data);
        } else { 
            setComplaints([]); 
        }
      } catch (error) {
        console.error("Error fetching complaints:", error); 
        setComplaints([]);
      } finally { setLoading(false); }
    };

    fetchComplaints();
  }, [auth.token]);

  // --- B. SSE Listener (Real-time OTP) ---
  useEffect(() => {
        if (!auth.email || !auth.token) return;
        
        setSseStatus('CONNECTING');
        const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
        let eventSource;

        try {
            eventSource = new EventSource(sseUrl);
            
            eventSource.onopen = () => {
                console.log("✅ SSE Connected");
                setSseStatus('CONNECTED');
            };

            // OTP Event Listener
            eventSource.addEventListener("verification_code", (event) => {
                const data = JSON.parse(event.data);
                console.log("🎉 OTP Received:", data);
                
                setVerificationCode(data.verificationCode);
                setComplaintToVerify(data.ticketId);
                
                toast.success("OTP Received! Check your screen.");
            });

            eventSource.onerror = (err) => {
                setSseStatus('DISCONNECTED'); 
                eventSource.close();
            };

        } catch (error) {
            console.error("SSE Setup Error:", error);
            setSseStatus('FAILED');
        }

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [auth.email, auth.token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Stats Logic
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In-Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const avgResolutionTime = "3.2 hrs"; // Mock data - calculate from actual data if available

  const handleCodeModalClose = () => {
    setVerificationCode(null);
    setComplaintToVerify(null);
  };

  // Generate recent activity from complaints
  const recentActivity = complaints
    .slice(0, 5)
    .map(complaint => {
      const activityTypes = {
        'New': 'new',
        'In-Progress': 'in-progress',
        'Resolved': 'resolved',
        'Closed': 'resolved'
      };
      
      return {
        type: activityTypes[complaint.status] || 'new',
        message: `Complaint ${complaint.status}: ${complaint.category}`,
        timestamp: new Date(complaint.dateRaised).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        ticketId: complaint.ticketId
      };
    });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 overflow-hidden relative transition-colors duration-300">
      
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-6 md:px-12 lg:px-20 py-10">
        
        {/* === HERO SECTION === */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Welcome Title */}
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700 mb-4"
              >
                <span className="relative flex h-3 w-3">
                  <span className={`${sseStatus === 'CONNECTED' ? 'animate-ping' : ''} absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${sseStatus === 'CONNECTED' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                </span>
                <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                  Real-time Status: {sseStatus === 'CONNECTED' ? 'Connected' : 'Connecting...'}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-900 dark:text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-emerald-500 to-blue-600 bg-clip-text text-transparent">{auth.name || 'Citizen'}</span> 👋
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                Here's an overview of your activity & updates.
              </p>
            </div>
          </div>
        </motion.div>

        {/* === KPI CARDS SECTION === */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <KpiCard
            title="Total Complaints"
            value={totalCount}
            icon={<FiFileText />}
            color="blue"
            index={0}
          />
          <KpiCard
            title="Active"
            value={inProgressCount}
            icon={<FiClock />}
            color="yellow"
            index={1}
          />
          <KpiCard
            title="Resolved"
            value={resolvedCount}
            icon={<FiCheckCircle />}
            color="green"
            trend={{ type: 'up', value: '+12%' }}
            index={2}
          />
          <KpiCard
            title="Avg Resolution"
            value={avgResolutionTime}
            icon={<FiTrendingUp />}
            color="purple"
            index={3}
          />
        </div>

        {/* === QUICK ACTIONS BAR === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4 mb-12"
        >
          <QuickActionButton
            icon={<FiPlusCircle />}
            label="Raise Complaint"
            onClick={() => navigate('/raise-complaint')}
            variant="primary"
          />
          <QuickActionButton
            icon={<FiFileText />}
            label="View All Complaints"
            onClick={() => navigate('/my-complaints')}
            variant="secondary"
          />
          <QuickActionButton
            icon={<FiSearch />}
            label="Track Status"
            onClick={() => navigate('/track-complaint')}
            variant="outline"
          />
        </motion.div>

        {/* === MAIN GRID: COMPLAINTS + ACTIVITY FEED === */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Recent Complaints List (Left - 2 columns) */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recent Complaints</h2>
                <Link 
                  to="/my-complaints"
                  className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
                      📋
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't raised any complaints yet.</p>
                    <button
                      onClick={() => navigate('/raise-complaint')}
                      className="px-6 py-2 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
                    >
                      Raise Your First Complaint
                    </button>
                  </div>
                ) : (
                  complaints.slice(0, 5).map((complaint, index) => (
                    <ComplaintCard key={complaint.ticketId} complaint={complaint} index={index} />
                  ))
                )}
              </div>
            </motion.div>
          </div>

          {/* Activity Feed (Right - 1 column) */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl sticky top-6"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400 text-sm">No recent activity</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <ActivityItem
                      key={index}
                      type={activity.type}
                      message={activity.message}
                      timestamp={activity.timestamp}
                      ticketId={activity.ticketId}
                    />
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* === OPTIONAL: MINI MAP WIDGET (Placeholder) === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-xl mb-12"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Complaint Locations</h2>
          <div className="h-64 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <FiMapPin className="text-6xl text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Map widget placeholder</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Your complaint locations will appear here</p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* === FLOATING ACTION BUTTON === */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => navigate('/raise-complaint')}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-emerald-500 text-white shadow-2xl hover:shadow-emerald-500/50 flex items-center justify-center text-2xl z-50 group"
        aria-label="Raise Complaint"
      >
        <FiPlusCircle />
        <span className="absolute right-20 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          Raise Complaint
        </span>
      </motion.button>

      {/* === VERIFICATION MODAL === */}
      {verificationCode && (
          <VerificationCodeModal 
            code={verificationCode} 
            ticketId={complaintToVerify} 
            onClose={handleCodeModalClose} 
          />
      )}

    </div>
  );
};

export default Dashboard;