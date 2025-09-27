// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// // Importing icons from the library
// import { FiSmile, FiBarChart2, FiSettings } from 'react-icons/fi';
// import './Home.css';

// const Home = () => {
//   const navigate = useNavigate();
//   const handleReportClick = () => navigate('/raise-complaint');

//   return (
//     <div className="home-page-container">
//       {/* Hero Section with new text */}
//       <section className="hero-section">
//         <div className="hero-content">
//           <h1>Innovate.<br />Create. Elevate.</h1>
//           <p>Your solution to streamlined utility complaint management. Efficient, transparent, and user-friendly.</p>
//           <button className="report-button" onClick={handleReportClick}>
//             Learn More
//           </button>
//         </div>
//       </section>

      
//       <section className="cards-section">
//         <div className="info-card">
//           {/* Nayi class 'icon-green' add ki */}
//           <div className="icon-wrapper icon-green">
//             <FiBarChart2 size={24} />
//           </div>
//           <h3>Fast Reporting</h3>
//           <p>Submit a complaint with a photo in under 60 seconds.</p>
//         </div>
//         <div className="info-card">
//           {/* Nayi class 'icon-blue' add ki */}
//           <div className="icon-wrapper icon-blue">
//             <FiSmile size={24} />
//           </div>
//           <h3>Real-time Tracking</h3>
//           <p>Track the status of your complaint from submission to resolution.</p>
//         </div>
//         <div className="info-card">
//           {/* Nayi class 'icon-yellow' add ki */}
//           <div className="icon-wrapper icon-yellow">
//             <FiSettings size={24} />
//           </div>
//           <h3>Transparent Process</h3>
//           <p>Get updates when an agent is assigned and the issue is closed.</p>
//         </div>
//       </section>

//     </div>
//   );
// };

// export default Home;




import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
// Step A: Import the new illustration
import heroIllustration from '../../assets/hero-illustration.png';

const Home = () => {
  const navigate = useNavigate();
  const handleReportClick = () => navigate('/raise-complaint');

  return (
    <div className="home-page-container">
      {/* Hero Section with 2-column layout */}
      <section className="hero-section">
        {/* Column 1: Text Content */}
        <div className="hero-content">
          <h1>Your Voice →<br />Our Action →<br />Instant Resolution.</h1>
          <p>The one-stop platform to report and track electricity & water issues in your area.</p>
          <button className="report-button" onClick={handleReportClick}>
            Report an Issue
          </button>
        </div>
        {/* Column 2: Image */}
        <div className="hero-image">
          <img src={heroIllustration} alt="Clean City Street Illustration" />
        </div>
      </section>

      {/* Cards Section (No changes here) */}

<section className="cards-section">
  <div className="section-title">
    <h2>A Simple and Transparent Process</h2>
    <p>Everything you need to know, in three simple steps.</p>
  </div>
  <div className="cards-container">
    <div className="info-card">
      {/* ...your existing card content... */}
    </div>
    <div className="info-card">
      {/* ...your existing card content... */}
    </div>
    <div className="info-card">
      {/* ...your existing card content... */}
    </div>
  </div>
</section>
    </div>
  );
};

export default Home;