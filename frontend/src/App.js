import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Assuming Navbar and Footer are in src/components/
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Corrected paths with a capital 'V' in "Visitor"
import Home from './pages/Visitor/Home';
import About from './pages/Visitor/About';
import HowItWorks from './pages/Visitor/HowItWorks';
import Contact from './pages/Visitor/Contact';
import RaiseComplaint from './pages/Visitor/RaiseComplaint';
import TrackComplaint from './pages/Visitor/TrackComplaint';
import Login from './pages/Visitor/Auth/Login';
import Register from './pages/Visitor/Auth/Register';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content-area">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add other routes for registered users if they exist */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;