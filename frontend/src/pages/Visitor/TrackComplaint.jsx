import React from 'react';
import './TrackComplaint.css';
// Importing icons for the timeline
import { FiSend, FiUserCheck, FiTool, FiCheckCircle } from 'react-icons/fi';

const TrackComplaint = () => {
  return (
    <main className="track-page-container">
      {/* Hero Section for this page */}
      <section className="track-hero">
        <h1>Track Your Complaint</h1>
        <p>Enter your Complaint ID below to see the latest status and updates.</p>
      </section>

      {/* Redesigned Tracking Section */}
      <section className="track-status-section">
        <div className="track-card">
          <form className="track-form">
            <input type="text" placeholder="Enter Complaint ID (e.g., TKT-12345)" required />
            <button type="submit">Track Status</button>
          </form>

          <div className="status-timeline">
            <div className="timeline-item completed">
              <div className="timeline-icon"><FiSend /></div>
              <div className="timeline-content">
                <h4>Submitted</h4>
                <p>Sept 12, 2025, 05:10 PM</p>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="timeline-icon"><FiUserCheck /></div>
              <div className="timeline-content">
                <h4>Agent Assigned</h4>
                <p>Agent: Ramesh Kumar</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon"><FiTool /></div>
              <div className="timeline-content">
                <h4>In Progress</h4>
                <p>The assigned agent is working on the issue.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-icon"><FiCheckCircle /></div>
              <div className="timeline-content">
                <h4>Resolved</h4>
                <p>The issue has been successfully resolved.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrackComplaint;