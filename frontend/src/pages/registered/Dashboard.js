import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import { FiFileText, FiClock, FiCheckCircle } from 'react-icons/fi';

const summaryData = [
  { title: 'Total Complaints', count: 3, icon: <FiFileText />, color: 'blue' },
  { title: 'In Progress', count: 1, icon: <FiClock />, color: 'yellow' },
  { title: 'Resolved', count: 2, icon: <FiCheckCircle />, color: 'green' },
];

const dummyComplaints = [
  { ticketId: 'TKT-001', category: 'Water Leakage', status: 'In Progress', dateRaised: '28 Sep, 2025' },
  { ticketId: 'TKT-002', category: 'Street Light Not Working', status: 'Resolved', dateRaised: '25 Sep, 2025' },
  { ticketId: 'TKT-003', category: 'Waste Management', status: 'New', dateRaised: '27 Sep, 2025' },
];

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, Diya!</h1>
        <Link to="/raise-complaint" className="report-button">
          + Raise New Complaint
        </Link>
      </div>

      <div className="summary-cards">
        {/* ... Summary cards section remains the same ... */}
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
          {dummyComplaints.map((complaint) => (
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
                <Link to="/complaint-details" className="details-link">View</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;