import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Assuming Navbar is in src/components/
import Footer from './components/Footer'; // Assuming Footer is in src/components/

// Corrected paths with a capital 'V' in "Visitor"
import About from './pages/visitor/About';
import HowItWorks from './pages/visitor/HowItWorks';
import Contact from './pages/visitor/Contact';
import RaiseComplaint from './pages/visitor/RaiseComplaint';
import TrackComplaint from './pages/visitor/TrackComplaint';
import Login from './pages/visitor/Auth/Login';
import Register from './pages/visitor/Auth/Register';

// You might need to import other pages like Home as well
// import Home from './pages/Visitor/Home';

import './App.css';

function App() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content-area">
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/raise-complaint" element={<RaiseComplaint />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Add other routes for your project here */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;