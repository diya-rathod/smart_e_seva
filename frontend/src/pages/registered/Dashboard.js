import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';
import { allComplaints } from '../../data/mockData'; // <-- Data ko yahan import karein

const summaryData = [
  { title: 'Total Complaints', count: allComplaints.length, icon: <FiFileText />, color: 'blue' },
  { title: 'In Progress', count: allComplaints.filter(c => c.status === 'In Progress').length, icon: <FiClock />, color: 'yellow' },
  { title: 'Resolved', count: allComplaints.filter(c => c.status === 'Resolved').length, icon: <FiCheckCircle />, color: 'green' },
];

const Dashboard = () => {
  return (
    // ... (baaki ka JSX bilkul same rahega) ...
    <div className="dashboard-container">
      {/* ... (Header and Summary Cards section) ... */}
       <div className="dashboard-header">
        <h1>Welcome back, Diya!</h1>
        <Link to="/raise-complaint" className="report-button">
          + Raise New Complaint
        </Link>
      </div>
      <div className="summary-cards">
        {summaryData.map(/* ... */)}
      </div>
      <div className="complaint-list-container">
        <div className="complaint-list-header">
          <h2>Recent Complaints</h2>
          {/* ... */}
        </div>
        <div className="complaint-list">
          {allComplaints.map((complaint) => ( // Yahan 'dummyComplaints' ki jagah 'allComplaints' use karein
            <div className="complaint-item" key={complaint.ticketId}>
              {/* ... (baaki sab same) ... */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;