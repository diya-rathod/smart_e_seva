import React, { useState, useEffect, useContext } from 'react';
import { Box, CircularProgress } from '@mui/material'; // Kept for layout/loading
import { Assignment, People, Engineering, ReportProblem, TrendingUp } from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { motion } from "framer-motion"; // Added for animation

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const AdminDashboard = () => {
    const { auth } = useContext(AuthContext);
    const [stats, setStats] = useState({
        totalComplaints: 0,
        activeComplaints: 0,
        totalCitizens: 0,
        agentsOnDuty: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            if (!auth || !auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                
                const complaintsPromise = axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
                const citizensPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_CITIZEN`, config);
                const agentsPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_AGENT`, config);

                const [complaintsRes, citizensRes, agentsRes] = await Promise.all([complaintsPromise, citizensPromise, agentsPromise]);

                const allComplaints = complaintsRes.data;
                const activeComplaints = allComplaints.filter(c => c.status === 'New' || c.status === 'In-Progress').length;
                
                const allAgents = agentsRes.data;
                const agentsOnDuty = allAgents.filter(a => a.availabilityStatus === 'ON_DUTY').length;

                setStats({
                    totalComplaints: allComplaints.length,
                    activeComplaints: activeComplaints,
                    totalCitizens: citizensRes.data.length,
                    agentsOnDuty: agentsOnDuty,
                });

            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [auth]);

    // UI Configuration for Cards
    const statCards = [
        { 
            title: 'Total Complaints', 
            value: stats.totalComplaints, 
            icon: <Assignment fontSize="large" />, 
            color: 'text-blue-600', 
            bg: 'bg-blue-100',
            border: 'border-blue-200'
        },
        { 
            title: 'Active Issues', 
            value: stats.activeComplaints, 
            icon: <ReportProblem fontSize="large" />, 
            color: 'text-amber-600', 
            bg: 'bg-amber-100',
            border: 'border-amber-200'
        },
        { 
            title: 'Total Citizens', 
            value: stats.totalCitizens, 
            icon: <People fontSize="large" />, 
            color: 'text-emerald-600', 
            bg: 'bg-emerald-100',
            border: 'border-emerald-200'
        },
        { 
            title: 'Agents on Duty', 
            value: stats.agentsOnDuty, 
            icon: <Engineering fontSize="large" />, 
            color: 'text-purple-600', 
            bg: 'bg-purple-100',
            border: 'border-purple-200'
        },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress sx={{ color: '#10B981' }} /> {/* Emerald Color */}
            </Box>
        );
    }

    return (
        <div className="min-h-full p-4 md:p-8">
            {/* Header Section */}
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Dashboard Overview
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Real-time updates on city maintenance and workforce.
                </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className={`relative overflow-hidden rounded-3xl p-6 bg-white dark:bg-slate-800 border ${stat.border} dark:border-slate-700 shadow-sm hover:shadow-xl transition-shadow duration-300`}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${stat.bg}`}></div>

                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                                <TrendingUp style={{ fontSize: 14, marginRight: 4 }} /> Live
                            </span>
                        </div>

                        <div>
                            <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">
                                {stat.value}
                            </h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {stat.title}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* --- CHARTS SECTION PLACEHOLDER (Styled) --- */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 shadow-sm flex items-center justify-center min-h-[300px] text-slate-400">
                    Analytics Chart Placeholder
                </div>
                <div className="rounded-3xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 p-8 shadow-sm flex items-center justify-center min-h-[300px] text-slate-400">
                    Recent Activity Placeholder
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;




// import React, { useState, useEffect, useContext } from 'react';
// import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
// import { Assignment, People, Engineering, ReportProblem } from '@mui/icons-material';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';

// const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// const StatCard = ({ title, value, icon, color }) => (
//     <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
//         <Box sx={{ bgcolor: color, color: 'white', p: 2, borderRadius: '50%', mr: 2, display: 'flex', alignItems: 'center' }}>
//             {icon}
//         </Box>
//         <Box>
//             <Typography color="text.secondary">{title}</Typography>
//             <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
//         </Box>
//     </Card>
// );

// const AdminDashboard = () => {
//     const { auth } = useContext(AuthContext);
//     const [stats, setStats] = useState({
//         totalComplaints: 0,
//         activeComplaints: 0,
//         totalCitizens: 0,
//         agentsOnDuty: 0,
//     });
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchDashboardStats = async () => {
//             if (!auth || !auth.token) return;
//             setLoading(true);
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                
//                 // Teeno API calls ek saath shuru karo
//                 const complaintsPromise = axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
//                 const citizensPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_CITIZEN`, config);
//                 const agentsPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_AGENT`, config);

//                 // Teeno ke poora hone ka wait karo
//                 const [complaintsRes, citizensRes, agentsRes] = await Promise.all([complaintsPromise, citizensPromise, agentsPromise]);

//                 // Data process karo
//                 const allComplaints = complaintsRes.data;
//                 const activeComplaints = allComplaints.filter(c => c.status === 'New' || c.status === 'In-Progress').length;
                
//                 const allAgents = agentsRes.data;
//                 // 'availabilityStatus' ko 'AVAILABLE' ya 'ON_DUTY' check kar sakte hain
//                 const agentsOnDuty = allAgents.filter(a => a.availabilityStatus === 'ON_DUTY').length;

//                 setStats({
//                     totalComplaints: allComplaints.length,
//                     activeComplaints: activeComplaints,
//                     totalCitizens: citizensRes.data.length,
//                     agentsOnDuty: agentsOnDuty,
//                 });

//             } catch (error) {
//                 console.error("Failed to fetch dashboard stats:", error);
//                 // Handle error state if needed
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchDashboardStats();
//     }, [auth]);

//     const statCards = [
//         { title: 'Total Complaints', value: stats.totalComplaints, icon: <Assignment />, color: 'primary.main' },
//         { title: 'Active Complaints', value: stats.activeComplaints, icon: <ReportProblem color="error" />, color: 'error.main' },
//         { title: 'Total Citizens', value: stats.totalCitizens, icon: <People />, color: 'success.main' },
//         { title: 'Agents on Duty', value: stats.agentsOnDuty, icon: <Engineering />, color: 'warning.main' },
//     ];

//     if (loading) {
//         return (
//             <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
//                 <CircularProgress />
//             </Box>
//         );
//     }

//     return (
//         <Box>
//             <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
//                 Dashboard
//             </Typography>
            
//             <Grid container spacing={3}>
//                 {statCards.map((stat, index) => (
//                     <Grid item xs={12} sm={6} md={3} key={index}>
//                         <StatCard {...stat} />
//                     </Grid>
//                 ))}
//             </Grid>

//             {/* --- CHARTS SECTION (Future work) --- */}
//             {/* ... Charts ka code yahan aayega ... */}
//         </Box>
//     );
// };

// export default AdminDashboard;





// import React, { useContext, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AuthContext from '../../context/AuthContext';
// import ComplaintsMap from './ComplaintsMap';
// import * as anime from 'animejs';

// const AdminDashboard = () => {
//     const { auth } = useContext(AuthContext);
//     const userRole = auth?.role;

//     // 2. useEffect animation ko component load hone ke baad chalayega
//     useEffect(() => {
//         anime.default({
//             targets: '.statistic-number', // Is class wale sabhi elements ko animate karein
//             innerHTML: [0, (el) => el.getAttribute('data-value')], // 0 se element ke data-value tak
//             round: 1, // Number ko round figure mein rakhein
//             easing: 'easeOutExpo', // Smooth animation effect
//             duration: 2000 // Animation ka time
//         });
//     }, []); // Khaali array [] ka matlab hai ki yeh sirf ek baar chalega

//     return (
//         <div>
//             <h1>Admin Dashboard</h1>

//             {/* 3. Naye Summary Cards */}
//             <div className="summary-cards-admin">
//                 <div className="summary-card-admin">
//                     <h3>Total Complaints</h3>
//                     {/* Hum abhi ke liye dummy values use kar rahe hain */}
//                     <p className="statistic-number" data-value="25">0</p>
//                 </div>
//                 <div className="summary-card-admin">
//                     <h3>New Complaints Today</h3>
//                     <p className="statistic-number" data-value="4">0</p>
//                 </div>
//                 <div className="summary-card-admin">
//                     <h3>Active Agents</h3>
//                     <p className="statistic-number" data-value="8">0</p>
//                 </div>
//             </div>
            
//             <div style={{ marginTop: '40px', marginBottom: '40px' }}>
//                 <p>Live view of incoming complaints on the map.</p>
//                 <ComplaintsMap />
//             </div>

//             <div className="quick-actions-section">
//                 <h2>Quick Actions</h2>
//                 <div style={{ display: 'flex', gap: '20px' }}>
//                     <Link to="/admin/register-citizen" className="btn btn-primary">
//                         + Register New Citizen
//                     </Link>
//                     <Link to="/admin/register-agent" className="btn btn-primary">
//                         + Register New Agent
//                     </Link>
//                     {userRole === 'ROLE_SUPER_ADMIN' && (
//                         <Link to="/admin/register-admin" className="btn btn-primary" style={{ backgroundColor: '#6f42c1' }}>
//                             + Register New Admin
//                         </Link>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default AdminDashboard;  