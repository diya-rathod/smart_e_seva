import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Inko import karein
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Visitor/Home'; // Home page ko import karein
import About from './pages/Visitor/About'; // About page ko import karein
import HowItWorks from './pages/Visitor/HowItWorks'; // Is page ko import karein
import Contact from './pages/Visitor/Contact'; // Contact page ko import karein
import RaiseComplaint from './pages/Visitor/RaiseComplaint'; // Is page ko import karein
import TrackComplaint from './pages/Visitor/TrackComplaint';
import Login from './pages/Visitor/Auth/Login'; // Login page ko import karein
import Register from './pages/Visitor/Auth/Register';

import './App.css';
function App() {
  return (
    <div className="App">
      <Navbar />
      {/* We've added a main tag with a className here */}
      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} /> {/* Naya route add karein */}
          <Route path="/register" element={<Register />} /> {/* Naya route add karein */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;