import React from 'react';
import './HowItWorks.css';
// Importing new icons for the steps
import { FiSend, FiUserCheck, FiCheckCircle } from 'react-icons/fi';

const HowItWorks = () => {
  return (
    <main className="how-page-container">
      {/* New Hero Section for this page */}
      <section className="how-hero">
        <h1>A Clear Path to Resolution</h1>
        <p>Our process is designed to be simple, transparent, and efficient from start to finish.</p>
      </section>

      {/* Redesigned Steps Section */}
      <section className="how-steps-section">
        <div className="step-card">
          <div className="step-icon">
            <FiSend size={28} />
          </div>
          <h3>1. Submit Your Complaint</h3>
          <p>Use our simple form to report an issue, upload a photo, and provide necessary details in just a few clicks.</p>
        </div>

        <div className="step-card">
          <div className="step-icon">
            <FiUserCheck size={28} />
          </div>
          <h3>2. We Assign an Agent</h3>
          <p>Our system alerts the admin team, who verifies your complaint and assigns the nearest available field agent.</p>
        </div>

        <div className="step-card">
          <div className="step-icon">
            <FiCheckCircle size={28} />
          </div>
          <h3>3. Get It Resolved</h3>
          <p>The agent resolves the issue and updates the status. You are notified immediately once the complaint is closed.</p>
        </div>
      </section>
    </main>
  );
};

export default HowItWorks;