import React from 'react';
import { useParams } from 'react-router-dom';
import './ComplaintDetails.css';
import { FiCheckCircle } from 'react-icons/fi';
import { allComplaints } from '../../data/mockData'; // <-- Data ko yahan import karein

const ComplaintDetails = () => {
  const { ticketId } = useParams();
  
  // Ab data central file se aa raha hai
  const complaint = allComplaints.find(c => c.ticketId === ticketId);

  if (!complaint) {
    return <h2>Complaint not found! Please check the Ticket ID.</h2>;
  }

  return (
    <div className="page-content-card">
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