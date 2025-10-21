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



// import React, { useState, useEffect,useContext, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import './Dashboard.css';
// import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';
// import AuthContext from '../../context/AuthContext';
// import Modal from '../../components/ui/Modal';
// import toast from 'react-hot-toast';

// const API_BASE_URL = 'http://localhost:8080/api/v1';

// const VerificationCodeModal = ({ code, ticketId, onClose }) => {
//     return (
//         <Modal isOpen={true} onClose={onClose} title={`Verification Code for ${ticketId}`}>
//             <div style={{ textAlign: 'center', padding: '20px' }}>
//                 <p>Please share this 6-digit code with the visiting agent to confirm resolution.</p>
//                 <h1 style={{ color: '#28a745', fontSize: '3em', border: '2px dashed #28a745', padding: '10px', borderRadius: '5px' }}>{code}</h1>
//                 <p style={{ fontSize: '0.9em', color: 'red' }}>DO NOT share this code before the service is complete.</p>
//                 <button onClick={onClose} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
//                     Close
//                 </button>
//             </div>
//         </Modal>
//     );
// };

// const Dashboard = () => {
//   const { auth } = useContext(AuthContext);
//   const [complaints, setComplaints] = useState([]); // Default is an empty array
//   const [loading, setLoading] = useState(true);

//   const [verificationCode, setVerificationCode] = useState(null); 
//   const [complaintToVerify, setComplaintToVerify] = useState(null);
//   const [sseStatus, setSseStatus] = useState('CONNECTING');

//   useEffect(() => {
//     const fetchComplaints = async () => {
//       if (!auth.token) { 
//                 setLoading(false);
//                 return;
//             }
//       try {
//         const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//         const response = await axios.get(`${API_BASE_URL}/users/my-complaints`, config);
//         // Safeguard: Ensure response.data is an array before setting state
//         if (Array.isArray(response.data)) {
//           setComplaints(response.data);
//         } else {
//           // If response is not an array, set an empty array to prevent crashes
//           setComplaints([]);
//           console.error("API did not return an array:", response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching complaints:", error);
//         setComplaints([]); // Set to empty array on error as well
//       } finally {
//         setLoading(false);
//       }
//       const cleanupSse = setupSSE();
//     };

//     fetchComplaints();

//     return () => {
//             cleanupSse();
//         };

//   }, [auth]);

//   useEffect(() => {
//         if (!auth.email || !auth.token) return;
//         setSseStatus('CONNECTING');

//         const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
//         const eventSource = new EventSource(sseUrl);

//         eventSource.onopen = () => {
//             setSseStatus('CONNECTED');
//         };

//         eventSource.addEventListener("verification_code", (event) => {
//             const data = JSON.parse(event.data);
//             setVerificationCode(data.verificationCode);
//             setComplaintToVerify(data.ticketId);
//             toast.info(`Verification code received for ${data.ticketId}`);
//         });

//         eventSource.onerror = (err) => {
//             console.error("SSE failed for Citizen:", err);
//             setSseStatus('DISCONNECTED');
//             eventSource.close();
//         };

//         return () => {
//           // console.log("Closing SSE Connection.");
//           eventSource.close(); // <-- FIX APPLIED
//   };
//     }, [auth.email, auth.token]);

//   if (loading) {
//     return <div className="loading-message">Loading your complaints...</div>;
//   }

//   // Calculate summary data using the state, which is guaranteed to be an array
//   const totalCount = complaints.length;
//   const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
//   const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

//   const summaryData = [
//     { title: 'Total Complaints', count: totalCount, icon: <FiFileText />, color: 'blue' },
//     { title: 'In Progress', count: inProgressCount, icon: <FiClock />, color: 'yellow' },
//     { title: 'Resolved', count: resolvedCount, icon: <FiCheckCircle />, color: 'green' },
//   ];

//   const handleCodeModalClose = () => {
//         setVerificationCode(null);
//         setComplaintToVerify(null);
//     };

//   return (
//     <div className="dashboard-container">
//       <div className="dashboard-header">
//         <h1>Welcome back, {auth.name }!</h1>
//         {/* FIX 3: SSE Status Indicator */}
//                 <p style={{ fontSize: '0.9em', color: sseStatus === 'CONNECTED' ? 'green' : 'red' }}>
//                     Real-time Status: {sseStatus}
//                 </p>
//       </div>


//       <div className="summary-cards">
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

//       {verificationCode && (
//                 <VerificationCodeModal 
//                     code={verificationCode}
//                     ticketId={complaintToVerify}
//                     onClose={handleCodeModalClose}
//                 />
//             )}

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
//           {complaints.length === 0 ? (
//             <div className="empty-state">
//               <p>You haven't raised any complaints yet.</p>
//             </div>
//           ) : (
//             // The map function will now always receive an array
//             complaints.map((complaint) => (
//               <div className="complaint-item" key={complaint.ticketId}>
//                 <div className="complaint-category">
//                   <span className="category-title">{complaint.category}</span>
//                   <span className="ticket-id">{complaint.ticketId}</span>
//                 </div>
//                 <div className="complaint-date">{complaint.dateRaised}</div>
//                 <div className="complaint-status">
//                   <span className={`status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
//                     {complaint.status}
//                   </span>
//                 </div>
//                 <div className="complaint-action">
//                   <Link to={`/complaint/${complaint.ticketId}`} className="details-link">View</Link>
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






//frontend/src/pages/registered/Dashboard.js

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import './Dashboard.css';
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

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
  const [sseStatus, setSseStatus] = useState('CONNECTING'); // SSE status state

  // --- 1. Fetch Complaints Logic (Security and Data Fetch) ---
  // Yeh useEffect sirf data fetch karta hai
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!auth.token) { setLoading(false); return; }
      try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        const response = await axios.get(`${API_BASE_URL}/users/my-complaints`, config);

        if (Array.isArray(response.data)) {
          setComplaints(response.data);
        } else { setComplaints([]); console.error("API did not return an array:", response.data); }
      } catch (error) {
        console.error("Error fetching complaints:", error); setComplaints([]);
      } finally { setLoading(false); }
    };

    fetchComplaints();
  }, [auth]);


  // --- 2. SSE Listener (Separate useEffect with Proper Cleanup) ---
  // Yeh useEffect sirf SSE connection aur verification code listener set karta hai
  // useEffect(() => {
  //   if (!auth.email || !auth.token) return;
  //   setSseStatus('CONNECTING');

  //   const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
  //   const eventSource = new EventSource(sseUrl);

  //   eventSource.onopen = () => {
  //     setSseStatus('CONNECTED');
  //   };

  //   eventSource.addEventListener("verification_code", (event) => {
  //     const data = JSON.parse(event.data);
  //     console.log("Verification Code Event Received:", data);
  //     setVerificationCode(data.verificationCode);
  //     setComplaintToVerify(data.ticketId);
  //     toast.info(`Verification code received for ${data.ticketId}`);
  //   });

  //   eventSource.onerror = (err) => {
  //     console.error("SSE failed for Citizen:", err);
  //     setSseStatus('DISCONNECTED');
  //     eventSource.close();
  //   };

  //   // FIX: Cleanup function mein eventSource.close() use karein (Solves ReferenceError)
  //   return () => {
  //     console.log("Closing SSE Connection.");
  //     eventSource.close();
  //   };

  // }, [auth.email, auth.token]);

  useEffect(() => {
        // STEP 1: Pehle check karo ki token hai ya nahi
        console.log("Auth context in SSE useEffect:", auth);

        if (!auth.email || !auth.token) {
            console.warn("SSE connection skipped: auth token or email is missing.");
            return; // Agar token nahi to aage mat badho
        }
        
        setSseStatus('CONNECTING');

        const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
        
        // STEP 2: Check karo ki URL sahi ban raha hai ya nahi
        console.log("Attempting to connect to SSE URL:", sseUrl);

        let eventSource; // isko bahar declare karte hain

        try {
            // STEP 3: Ab connection banao
            eventSource = new EventSource(sseUrl);
            
            eventSource.onopen = () => {
                console.log("✅ SSE Connection Established!");
                setSseStatus('CONNECTED');
            };

            eventSource.addEventListener("verification_code", (event) => {
                const data = JSON.parse(event.data);
                console.log("🎉 Verification Code Event Received:", data);
                setVerificationCode(data.verificationCode);
                setComplaintToVerify(data.ticketId);
                toast.success(`Verification code received for ${data.ticketId}, ${data.verificationCode}`);
            });

            eventSource.onerror = (err) => {
                console.error("❌ SSE Connection Failed:", err);
                setSseStatus('DISCONNECTED'); 
                eventSource.close();
            };

        } catch (error) {
            console.error("FATAL: Could not create EventSource. Is the URL correct? Error:", error);
            setSseStatus('FAILED');
        }

        // Cleanup function
        return () => {
            if (eventSource) {
                console.log("Closing SSE Connection.");
                eventSource.close();
            }
        };
    
    }, [auth.email, auth.token]);


  if (loading) {
    return <div className="loading-message">Loading your complaints...</div>;
  }

  // Calculate summary data (Logic remains the same)
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
      <div className="dashboard-header">
        {/* Dynamic User Name */}
        <h1>Welcome back, {auth.name || 'Citizen'}!</h1>
        {/* SSE Status Indicator */}
        <p style={{ fontSize: '0.9em', color: sseStatus === 'CONNECTED' ? 'green' : 'red' }}>
          Real-time Status: {sseStatus}
        </p>
      </div>


      {/* ... (Summary Cards mapping) ... */}
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
            // The map function will now always receive an array
            complaints.map((complaint) => (
              <div className="complaint-item" key={complaint.ticketId}>
                <div className="complaint-category">
                  <span className="category-title">{complaint.category}</span>
                  <span className="ticket-id">{complaint.ticketId}</span>
                </div>
                <div className="complaint-date">{complaint.dateRaised}</div>
                <div className="complaint-status">
                  <span className={`status status-${complaint.status.toLowerCase().replace(' ', '-')}`}>
                    {complaint.status}
                  </span>
                </div>
                <div className="complaint-action">
                  <Link to={`/complaint/${complaint.ticketId}`} className="details-link">View</Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* {verificationCode && complaintToVerify && (
    <div style={{ 
        position: 'fixed', 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'lightgreen', 
        padding: '50px', 
        border: '2px solid red',
        zIndex: 9999 
    }}>
        <h1>CODE RECEIVED: {verificationCode}</h1>
        <h2>TICKET: {complaintToVerify}</h2>
    </div>
)} */}
    </div>
  );
};

export default Dashboard;