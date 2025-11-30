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
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import './Dashboard.css';
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

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


  if (loading) return <div className="loading-message">Loading...</div>;

  // Stats Logic
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In-Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const summaryData = [
    { title: 'Total Complaints', count: totalCount, icon: <FiFileText />, color: 'blue' },
    { title: 'In Progress', count: inProgressCount, icon: <FiClock />, color: 'yellow' },
    { title: 'Resolved', count: resolvedCount, icon: <FiCheckCircle />, color: 'green' },
  ];

  const handleCodeModalClose = () => {
    setVerificationCode(null);
    setComplaintToVerify(null);
  };

  return (
    <div className="dashboard-container">
      
      {/* 1. HEADER */}
      <div className="dashboard-header">
        <h1>Welcome back, {auth.name || 'Citizen'}!</h1>
        <p style={{ fontSize: '0.8em', color: 'gray' }}>
          Live Status: <span style={{color: sseStatus === 'CONNECTED' ? 'green' : 'red', fontWeight: 'bold'}}>{sseStatus}</span>
        </p>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="summary-cards">
        {summaryData.map((card, index) => (
          <div className="summary-card" key={index}>
            <div className={`summary-icon-wrapper icon-${card.color}`}>
              {card.icon}
            </div>
            <div className="summary-info">
              <span className="summary-title">{card.title}</span>
              <span className="summary-count">{card.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. COMPLAINT LIST TABLE */}
      <div className="complaint-list-container">
        <div className="complaint-list-header">
          <h2>Recent Complaints</h2>
          <div className="complaint-list-column-titles">
            <span>Category / Ticket ID</span>
            <span>Date Raised</span>
            <span>Status</span>
            <span>Action</span>
          </div>
        </div>

        <div className="complaint-list">
          {complaints.length === 0 ? (
            <div className="empty-state">
              <p>You haven't raised any complaints yet.</p>
            </div>
          ) : (
            complaints.map((complaint) => (
              <div className="complaint-item" key={complaint.ticketId}>
                <div className="complaint-category">
                  <span className="category-title">{complaint.category}</span>
                  <span className="ticket-id">{complaint.ticketId}</span>
                </div>
                <div className="complaint-date">{new Date(complaint.dateRaised).toLocaleDateString()}</div>
                <div className="complaint-status">
                  <span className={`status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-action">
                  {/* FIX: Link variable corrected from c.ticketId to complaint.ticketId */}
                  <Link to={`/complaint/${complaint.ticketId}`} className="details-link">View</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. VERIFICATION MODAL (Conditional Render) */}
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