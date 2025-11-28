// // import React from 'react';
// // import { Routes, Route, Outlet } from 'react-router-dom';

// // // --- Layouts ---
// // import RegisteredLayout from './components/dashboard/RegisteredLayout';
// // import Navbar from './components/Navbar';
// // import Footer from './components/Footer';
// // import { Toaster } from 'react-hot-toast';

// // // --- Visitor Pages ---
// // import Home from './pages/visitor/Home';
// // import About from './pages/visitor/About';
// // import HowItWorks from './pages/visitor/HowItWorks';
// // import Contact from './pages/visitor/Contact';
// // import RaiseComplaint from './pages/visitor/RaiseComplaint';
// // import TrackComplaint from './pages/visitor/TrackComplaint';
// // import Login from './pages/visitor/Auth/Login';

// // // --- Registered User Pages ---
// // import CitizenDashboard from './pages/registered/Dashboard'; // Using your name 'CitizenDashboard'
// // import Profile from './pages/registered/Profile';
// // import Help from './pages/registered/Help';
// // import ComplaintDetails from './pages/registered/ComplaintDetails';
// // import RaiseComplaintPage from './pages/registered/RaiseComplaintPage';
// // import AdminDashboard from './pages/admin/AdminDashboard';
// // import AdminLayout from './components/admin/AdminLayout';
// // import RegisterCitizenPage from './pages/admin/RegisterCitizenPage';
// // import RegisterAgentPage from './pages/admin/RegisterAgentPage';
// // import RegisterAdminPage from './pages/admin/RegisterAdminPage';
// // import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';
// // import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
// // import CssBaseline from '@mui/material/CssBaseline'; // CSS Reset ke liye
// // import { ThemeProvider, createTheme } from '@mui/material/styles';

// // import './App.css';

// // /**
// //  * Yeh layout un sabhi pages ke liye hai jo public hain (login se pehle).
// //  */
// // const VisitorLayout = () => (
// //  <>
// //   <Navbar />
// //   <main className="main-content-area">
// //    <Outlet /> {/* Public pages yahan render honge */}
// //   </main>
// //   <Footer />
// //  </>
// // );

// // function App() {
// //  return (
// //   <>
// //   <ThemeProvider theme={defaultTheme}>
// //         <CssBaseline /> 
// //   <Toaster 
// //     position="top-right" 
// //     toastOptions={{
// //      duration: 5000, // Notification 5 second tak dikhegi
// //     }}
// //    />
// //   <Routes>
// //    {/* Group 1: Visitor Routes jo Navbar/Footer use karte hain */}

// //    <Route element={<VisitorLayout />}>
// //     <Route path="/" element={<Home />} />
// //     <Route path="/about" element={<About />} />
// //     <Route path="/how-it-works" element={<HowItWorks />} />
// //     <Route path="/contact" element={<Contact />} />
// //     <Route path="/track-complaint" element={<TrackComplaint />} />
// //     <Route path="/login" element={<Login />} />
// //     {/* Note: We will handle raise-complaint separately for visitors if needed */}
// //    </Route>

// //    {/* Group 2: Registered User Routes jo Sidebar use karte hain */}
// //    <Route element={<RegisteredLayout />}>
// //     <Route path="/dashboard" element={<CitizenDashboard />} />
// //     <Route path="/profile" element={<Profile />} />
// //     <Route path="/help" element={<Help />} />
// //     <Route path="/complaint/:ticketId" element={<ComplaintDetails />} />
// //     <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
// //    </Route>
// //    {/* Sub-Group B: Admin Routes */}
// //     <Route element={<AdminLayout />}>
// //      <Route path="/admin/dashboard" element={<AdminDashboard />} />
// //      <Route path="/admin/register-citizen" element={<RegisterCitizenPage />} />
// //      <Route path="/admin/register-agent" element={<RegisterAgentPage />} />
// //      <Route path="/admin/register-admin" element={<RegisterAdminPage />} />
// //      <Route path="/admin/manage-complaints" element={<ManageComplaintsPage />} />
// //      <Route path="/admin/complaints/:id" element={<AdminComplaintDetailsPage />} />
// //      {/* Future admin routes will go here */}
// //     </Route>
// //   </Routes>
// //    </ThemeProvider>
// //  </> 
// //  );
// // }

// // export default App;
// // src/App.js (Corrected)
// import React from 'react';
// import { Routes, Route, Outlet } from 'react-router-dom';

// // --- Layouts ---
// import RegisteredLayout from './components/dashboard/RegisteredLayout';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import { Toaster } from 'react-hot-toast';
// import { ThemeProvider } from './context/ThemeContext';
// // --- Visitor Pages ---
// import Home from './pages/visitor/Home';
// import About from './pages/visitor/About';
// import HowItWorks from './pages/visitor/HowItWorks';
// import Contact from './pages/visitor/Contact';
// import RaiseComplaint from './pages/visitor/RaiseComplaint';
// import TrackComplaint from './pages/visitor/TrackComplaint';
// import Login from './pages/visitor/Auth/Login';

// // --- Registered User Pages ---
// import CitizenDashboard from './pages/registered/Dashboard'; // Using your name 'CitizenDashboard'
// import Profile from './pages/registered/Profile';
// import Help from './pages/registered/Help';
// import ComplaintDetails from './pages/registered/ComplaintDetails';
// import RaiseComplaintPage from './pages/registered/RaiseComplaintPage';
// import AdminDashboard from './pages/admin/AdminDashboard';
// import AdminLayout from './components/admin/AdminLayout';
// import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
// import RegisterCitizenPage from './pages/admin/RegisterCitizenPage';
// import RegisterAgentPage from './pages/admin/RegisterAgentPage';
// import RegisterAdminPage from './pages/admin/RegisterAdminPage';
// import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';

// import AgentDashboardPage from './pages/agent/AgentDashboardPage';
// import AgentLayout from './components/agent/AgentLayout';
// import AgentComplaintDetailsPage from './pages/agent/AgentComplaintDetailsPage';
// import AdminProfile from './pages/admin/AdminProfile';
// import AgentProfile from './pages/agent/AgentProfile';
// import ComplaintsMapPage from './pages/admin/ComplaintsMapPage';

// import ProtectedRoute from './pages/Common/ProtectedRoute'; // ⬅️ FIX: Path updated to pages/common
// import NotFound from './pages/Common/NotFound.jsx';       // ⬅️ FIX: Path updated to pages/common
// import NewComplaintsPage from './pages/admin/NewComplaintsPage';
// import ManageCitizensPage from './pages/admin/ManageCitizensPage';
// import ManageAgentsPage from './pages/admin/ManageAgentsPage';
// import ManageAdminsPage from './pages/admin/ManageAdminsPage';
// import AdminCitizenDetailsPage from './pages/admin/AdminCitizenDetailsPage'; // <-- Naya Import
// import AdminAgentDetailsPage from './pages/admin/AdminAgentDetailsPage'; // <-- Naya Import
// import AdminAdminDetailsPage from './pages/admin/AdminAdminDetailsPage';
// import './App.css';

// /**
//  * Yeh layout un sabhi pages ke liye hai jo public hain (login se pehle).
//  */
// const VisitorLayout = () => (
//   <>
//     <Navbar />
//     <main className="main-content-area">
//       <Outlet /> {/* Public pages yahan render honge */}
//     </main>
//     <Footer />
//   </>
// );

// function App() {
//   return (
//     <>
//       <Toaster
//         position="top-right"
//         toastOptions={{
//           duration: 5000, // Notification 5 second tak dikhegi
//         }}
//       />
//       <Routes>
//         {/* Group 1: Visitor Routes jo Navbar/Footer use karte hain */}

//         <Route element={<VisitorLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/how-it-works" element={<HowItWorks />} />
//           <Route path="/contact" element={<Contact />} />
//           <Route path="/track-complaint" element={<TrackComplaint />} />
//           <Route path="/login" element={<Login />} />
//           {/* Note: We will handle raise-complaint separately for visitors if needed */}


//         </Route>

//         {/* Group 2: Registered User Routes jo Sidebar use karte hain */}
//         <Route element={<RegisteredLayout />}>
//           <Route path="/dashboard" element={<CitizenDashboard />} />
//           <Route path="/profile" element={<Profile />} />
//           <Route path="/help" element={<Help />} />
//           <Route path="/complaint/:ticketId" element={<ComplaintDetails />} />
//           <Route path="/raise-complaint" element={<RaiseComplaintPage />} />


//         </Route>
//         {/* Sub-Group B: Admin Routes */}
//         <Route element={<AdminLayout />}>
//           <Route path="/admin/dashboard" element={<AdminDashboard />} />
//           <Route path="/admin/register-citizen" element={<RegisterCitizenPage />} />
//           <Route path="/admin/register-agent" element={<RegisterAgentPage />} />
//           <Route path="/admin/register-admin" element={<RegisterAdminPage />} />
//           <Route path="/admin/manage-complaints" element={<ManageComplaintsPage />} />
//           <Route path="/admin/complaints/:id" element={<AdminComplaintDetailsPage />} />
//           <Route path="/admin/profile" element={<AdminProfile />} />
//           <Route path="/admin/new-complaints" element={<NewComplaintsPage />} />
//           <Route path="/admin/manage-citizens" element={<ManageCitizensPage />} />
//           <Route path="/admin/manage-agents" element={<ManageAgentsPage />} />
//           <Route path="/admin/manage-admins" element={<ManageAdminsPage />} />
//           <Route path="/admin/live-map" element={<ComplaintsMapPage />} />
//           <Route path="/admin/citizen/:id" element={<AdminCitizenDetailsPage />} /> 
//           <Route path="/admin/agent/:id" element={<AdminAgentDetailsPage />} />
//           <Route path="/admin/admin/:id" element={<AdminAdminDetailsPage />} />
//           {/* Future admin routes will go here */}
//         </Route>
       

//         <Route element={<AgentLayout />}>
//           <Route path="/agent/dashboard" element={<AgentDashboardPage />} />

//           <Route path="/agent/complaint/:id" element={<AgentComplaintDetailsPage />} />
//           <Route path="/agent/profile" element={<AgentProfile />} />
//         </Route>
//       </Routes>
//     </>
//   );
// }

// export default App;





import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// --- Layouts ---
import RegisteredLayout from './components/dashboard/RegisteredLayout';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

// --- Context Import (IMPORTANT) ---
// Note: Agar aapka ThemeContext file ka path alag hai, to ise adjust kar lena.
// Error ke hisab se ye './context/ThemeContext' hona chahiye.
import { ThemeProvider } from './context/ThemeContext'; 

// --- Visitor Pages ---
import Home from './pages/Visitor/Home';
import About from './pages/Visitor/About';
import HowItWorks from './pages/Visitor/HowItWorks';
import Contact from './pages/Visitor/Contact';
import TrackComplaint from './pages/Visitor/TrackComplaint';
import Login from './pages/Visitor/Auth/Login';

// --- Registered User Pages ---
import CitizenDashboard from './pages/registered/Dashboard';
import Profile from './pages/registered/Profile';
import Help from './pages/registered/Help';
import ComplaintDetails from './pages/registered/ComplaintDetails';
import RaiseComplaintPage from './pages/registered/RaiseComplaintPage';

// --- Admin Pages ---
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
import RegisterCitizenPage from './pages/admin/RegisterCitizenPage';
import RegisterAgentPage from './pages/admin/RegisterAgentPage';
import RegisterAdminPage from './pages/admin/RegisterAdminPage';
import ManageComplaintsPage from './pages/admin/ManageComplaintsPage';
import NewComplaintsPage from './pages/admin/NewComplaintsPage';
import ManageCitizensPage from './pages/admin/ManageCitizensPage';
import ManageAgentsPage from './pages/admin/ManageAgentsPage';
import ManageAdminsPage from './pages/admin/ManageAdminsPage';
import AdminCitizenDetailsPage from './pages/admin/AdminCitizenDetailsPage';
import AdminAgentDetailsPage from './pages/admin/AdminAgentDetailsPage';
import AdminAdminDetailsPage from './pages/admin/AdminAdminDetailsPage';
import AdminProfile from './pages/admin/AdminProfile';
import ComplaintsMapPage from './pages/admin/ComplaintsMapPage';

// --- Agent Pages ---
import AgentDashboardPage from './pages/agent/AgentDashboardPage';
import AgentLayout from './components/agent/AgentLayout';
import AgentComplaintDetailsPage from './pages/agent/AgentComplaintDetailsPage';
import AgentProfile from './pages/agent/AgentProfile';
import AgentHistoryPage from './pages/agent/AgentHistoryPage';

import './App.css';

/**
 * Yeh layout un sabhi pages ke liye hai jo public hain (login se pehle).
 */
const VisitorLayout = () => (
  <>
    <Navbar />
    <main className="main-content-area">
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    // 👇 Change 1: Yahan ThemeProvider se wrap karna zaroori hai
    <ThemeProvider> 
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 5000,
        }}
      />
      <Routes>
        {/* Group 1: Visitor Routes */}
        <Route element={<VisitorLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/track-complaint" element={<TrackComplaint />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Group 2: Registered User Routes */}
        <Route element={<RegisteredLayout />}>
          <Route path="/dashboard" element={<CitizenDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/complaint/:ticketId" element={<ComplaintDetails />} />
          <Route path="/raise-complaint" element={<RaiseComplaintPage />} />
        </Route>

        {/* Group 3: Admin Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/register-citizen" element={<RegisterCitizenPage />} />
          <Route path="/admin/register-agent" element={<RegisterAgentPage />} />
          <Route path="/admin/register-admin" element={<RegisterAdminPage />} />
          <Route path="/admin/manage-complaints" element={<ManageComplaintsPage />} />
          <Route path="/admin/complaints/:id" element={<AdminComplaintDetailsPage />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/new-complaints" element={<NewComplaintsPage />} />
          <Route path="/admin/manage-citizens" element={<ManageCitizensPage />} />
          <Route path="/admin/manage-agents" element={<ManageAgentsPage />} />
          <Route path="/admin/manage-admins" element={<ManageAdminsPage />} />
          <Route path="/admin/live-map" element={<ComplaintsMapPage />} />
          <Route path="/admin/citizen/:id" element={<AdminCitizenDetailsPage />} />
          <Route path="/admin/agent/:id" element={<AdminAgentDetailsPage />} />
          <Route path="/admin/admin/:id" element={<AdminAdminDetailsPage />} />
        </Route>

        {/* Group 4: Agent Routes */}
        <Route element={<AgentLayout />}>
          <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
          <Route path="/agent/complaint/:id" element={<AgentComplaintDetailsPage />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="history" element={<AgentHistoryPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;