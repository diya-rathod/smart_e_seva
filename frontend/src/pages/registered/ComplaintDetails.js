import React from 'react';
import { useParams } from 'react-router-dom';
import './ComplaintDetails.css';
// Icons for the timeline
import { FiCheckCircle } from 'react-icons/fi';
import { allComplaints } from '../../data/mockData';

const allComplaints = [
  { 
    ticketId: 'TKT-001', 
    category: 'Water Leakage',
    dateRaised: '2025-09-28',
    description: 'Significant water pipe leakage near the community hall.',
    photoUrl: 'https://via.placeholder.com/400x250.png?text=Leaking+Pipe',
    location: '123, Main Street, Ahmedabad',
    agent: { name: 'Ramesh Patel', contact: '+91 98765 43210' },
    // New timeline structure
    timeline: [
      { step: 'Submitted', date: '28 Sep, 09:25 AM', completed: true },
      { step: 'Assigned', date: '28 Sep, 10:05 AM', completed: true },
      { step: 'In Progress', date: '28 Sep, 11:00 AM', completed: true, active: true },
      { step: 'Resolved', date: null, completed: false },
    ],
    updates: [
      { timestamp: '2025-09-28 11:00 AM', note: 'Agent has started working on the issue.' },
      { timestamp: '2025-09-28 10:05 AM', note: 'Complaint assigned to agent Ramesh Patel.' },
    ] 
  },
  // ... (other complaints data)
];

const ComplaintDetails = () => {
  const { ticketId } = useParams();
  const complaint = allComplaints.find(c => c.ticketId === ticketId);

  if (!complaint) {
    return <div>Complaint not found!</div>;
  }

  return (
    <div className="complaint-details-container">
      <h1>Complaint Details: {complaint.ticketId}</h1>
      <div className="details-grid">
        <div className="details-main">
          {/* ... Other sections remain the same ... */}
          <div className="details-section">
            <h2>Description</h2>
            <p>{complaint.description}</p>
          </div>
          <div className="details-section">
            <h2>Photo Evidence</h2>
            <img src={complaint.photoUrl} alt="Complaint Evidence" />
          </div>
        </div>

        <div className="details-sidebar">
          {/* --- UPDATED STATUS TIMELINE --- */}
          <div className="details-section status-timeline">
            <h2>Status Timeline</h2>
            <ul>
              {complaint.timeline.map((item, index) => (
                <li key={index} className={`${item.completed ? 'completed' : ''} ${item.active ? 'active' : ''}`}>
                  <div className="timeline-icon">
                    {item.completed && !item.active ? <FiCheckCircle /> : <div className="dot"></div>}
                  </div>
                  <div className="timeline-content">
                    <span className="timeline-step">{item.step}</span>
                    <span className="timeline-date">{item.date}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="details-section agent-details">
            <h2>Assigned Agent</h2>
            <p><strong>Name:</strong> {complaint.agent.name}</p>
            <p><strong>Contact:</strong> {complaint.agent.contact}</p>
          </div>

          <div className="details-section updates-log">
            <h2>Updates Log</h2>
            <ul>
              {complaint.updates.map((update, index) => (
                <li key={index}>
                  <strong>{update.timestamp}:</strong> {update.note}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;