import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Importing all pages with correct paths
import Home from './pages/visitor/Home'; // Home page import add kiya
import About from './pages/visitor/About';
import HowItWorks from './pages/visitor/HowItWorks';
import Contact from './pages/visitor/Contact';
import RaiseComplaint from './pages/visitor/RaiseComplaint';
import TrackComplaint from './pages/visitor/TrackComplaint';
import Login from './pages/visitor/Auth/Login';
import Register from './pages/visitor/Auth/Register';
import CitizenDashboard from './pages/registered/Dashboard';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home page route add kiya */}
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/registered/dashboard" element={<CitizenDashboard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;