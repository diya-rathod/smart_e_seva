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



import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

const Dashboard = () => {
  const [complaints, setComplaints] = useState([]); // Default is an empty array
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/complaints');
        // Safeguard: Ensure response.data is an array before setting state
        if (Array.isArray(response.data)) {
          setComplaints(response.data);
        } else {
          // If response is not an array, set an empty array to prevent crashes
          setComplaints([]);
          console.error("API did not return an array:", response.data);
        }
      } catch (error) {
        console.error("Error fetching complaints:", error);
        setComplaints([]); // Set to empty array on error as well
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) {
    return <div className="loading-message">Loading your complaints...</div>;
  }
  
  // Calculate summary data using the state, which is guaranteed to be an array
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  const summaryData = [
    { title: 'Total Complaints', count: totalCount, icon: <FiFileText />, color: 'blue' },
    { title: 'In Progress', count: inProgressCount, icon: <FiClock />, color: 'yellow' },
    { title: 'Resolved', count: resolvedCount, icon: <FiCheckCircle />, color: 'green' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, Diya!</h1>
      </div>

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
    </div>
  );
};

export default Dashboard;