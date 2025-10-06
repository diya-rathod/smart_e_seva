import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- Layouts ---
import RegisteredLayout from './components/dashboard/RegisteredLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- Visitor Pages ---
import Home from './pages/Visitor/Home';
import About from './pages/Visitor/About';
import HowItWorks from './pages/Visitor/HowItWorks';
import Contact from './pages/Visitor/Contact';
import RaiseComplaint from './pages/Visitor/RaiseComplaint';
import TrackComplaint from './pages/Visitor/TrackComplaint';
import Login from './pages/Visitor/Auth/Login';
import Register from './pages/Visitor/Auth/Register';

// --- Registered User Pages ---
import CitizenDashboard from './pages/registered/Dashboard'; // Using your name 'CitizenDashboard'
import Profile from './pages/registered/Profile';
import Help from './pages/registered/Help';
import ComplaintDetails from './pages/registered/ComplaintDetails';
import RaiseComplaintPage from './pages/registered/RaiseComplaintPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import RegisterCitizenPage from './pages/admin/RegisterCitizenPage';

import './App.css';

/**
 * Yeh layout un sabhi pages ke liye hai jo public hain (login se pehle).
 */
const VisitorLayout = () => (
  <>
    <Navbar />
    <main className="main-content-area">
      <Outlet /> {/* Public pages yahan render honge */}
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Routes>
      {/* Group 1: Visitor Routes jo Navbar/Footer use karte hain */}
      <Route element={<VisitorLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/track-complaint" element={<TrackComplaint />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Note: We will handle raise-complaint separately for visitors if needed */}
      </Route>

      {/* Group 2: Registered User Routes jo Sidebar use karte hain */}
      <Route element={<RegisteredLayout />}>
        <Route path="/dashboard" element={<CitizenDashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/help" element={<Help />} />
        <Route path="/complaint/:ticketId" element={<ComplaintDetails />} />
        <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
      </Route>
       {/* Sub-Group B: Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register-citizen" element={<RegisterCitizenPage />} />
          {/* Future admin routes will go here */}
        </Route>
    </Routes>
  );
}

export default App;