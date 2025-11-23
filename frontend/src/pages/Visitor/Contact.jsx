import React from 'react';
import './Contact.css';
import { FiPhone, FiMessageSquare } from 'react-icons/fi';

const Contact = () => {
  return (
    <main className="contact-page-container">
      {/* Hero Section */}
      <section className="contact-hero">
        <h1>Get In Touch</h1>
        <p>We're here to help. Reach out to us with any questions or follow up on an issue.</p>
      </section>

      {/* Main Content Area */}
      <section className="contact-content-section">
        <div className="contact-form-wrapper">
          <h3>Send us a Message</h3>
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" rows="6" required></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
        <div className="contact-info-wrapper">
          <h3>Contact Information</h3>
          <div className="info-item">
            <FiPhone />
            <div>
              <h4>Emergency Helplines</h4>
              <p>Electricity Board: 1912</p>
              <p>Water Supply: 1800-425-1333</p>
            </div>
          </div>
          <div className="info-item">
            <FiMessageSquare />
            <div>
              <h4>Social Media</h4>
              <p>Follow us for updates and news.</p>
              <div className="social-links">
                <a href="#">WhatsApp</a>
                <a href="#">Telegram</a>
                <a href="#">Twitter</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contact;