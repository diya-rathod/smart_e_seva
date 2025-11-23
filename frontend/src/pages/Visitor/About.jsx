import React from 'react';
import './About.css';
// Let's use some icons to make the page more visual
import { FiTarget, FiEye, FiZap } from 'react-icons/fi';

const About = () => {
  return (
    <main className="about-page-container">
      <div className="about-hero">
        <h1>Our Mission: Powering Better Communities</h1>
        <p>We are dedicated to improving civic infrastructure by creating a direct line of communication between citizens and the authorities.</p>
      </div>

      <div className="about-features">
        <div className="feature-card">
          <div className="feature-icon">
            <FiTarget size={28} />
          </div>
          <h3>Our Goal</h3>
          <p>To provide a simple, efficient, and transparent platform for reporting and resolving essential utility issues, ensuring accountability and faster service.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FiEye size={28} />
          </div>
          <h3>Our Vision</h3>
          <p>We envision smarter cities where technology empowers citizens and improves the quality of life, ensuring reliable electricity and clean water for everyone.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">
            <FiZap size={28} />
          </div>
          <h3>Our Focus</h3>
          <p>Focusing initially on critical services like electricity and water, we plan to expand our platform to include other civic services in the near future.</p>
        </div>
      </div>
    </main>
  );
};

export default About;