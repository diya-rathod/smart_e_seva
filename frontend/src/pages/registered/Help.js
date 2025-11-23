import React from 'react';
import './Help.css';

const Help = () => {
  return (
    <div className="page-content-card">
      <h1>Support / Help Center</h1>

      {/* --- FAQs Section --- */}
      <div className="help-section">
        <h2>Frequently Asked Questions (FAQs)</h2>
        <div className="faq-item">
          <h3>How do I track my complaint?</h3>
          <p>You can track the status of all your complaints from the 'My Complaints' dashboard. The current status (New, In Progress, Resolved) will be displayed next to each complaint.</p>
        </div>
        <div className="faq-item">
          <h3>How long does it take to resolve a complaint?</h3>
          <p>The resolution time depends on the category and severity of the issue. Our team aims to assign an agent within 24 hours and resolve most issues within 3-5 business days.</p>
        </div>
        <div className="faq-item">
          <h3>Can I add more photos after submitting a complaint?</h3>
          <p>Currently, you cannot add more photos after a complaint has been submitted. Please be sure to include all necessary images when you first raise the complaint.</p>
        </div>
      </div>

      {/* --- Contact Form Section --- */}
      <div className="help-section">
        <h2>Still Need Help?</h2>
        <p>If you have any other questions or need help with the system, please send us a message below.</p>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="query">Your Message</label>
            <textarea id="query" rows="5" placeholder="Type your question here..."></textarea>
          </div>
          <button type="submit" className="btn">Submit Query</button>
        </form>
      </div>

      {/* --- Emergency Contacts Section --- */}
      <div className="help-section">
        <h2>Emergency Contacts</h2>
        <ul className="emergency-contacts">
          <li>Police: <strong>100</strong></li>
          <li>Fire Brigade: <strong>101</strong></li>
          <li>Medical Emergency / Ambulance: <strong>108</strong></li>
        </ul>
      </div>
    </div>
  );
};

export default Help;