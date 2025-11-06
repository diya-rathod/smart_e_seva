// import React, { useState, useEffect, useContext } from 'react';
// import {
//     Box, Typography, Card, CircularProgress
// } from '@mui/material';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import AuthContext from '../../context/AuthContext';
// import ComplaintsMap from './ComplaintsMap'; // Map component

// const API_BASE_URL = 'http://localhost:8080/api/v1';

// const AdminDashboard = () => {
//     const { auth } = useContext(AuthContext);
//     const [complaints, setComplaints] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // Data fetch karne ke liye useEffect
//     useEffect(() => {
//         const fetchComplaints = async () => {
//             if (!auth || !auth.token) return;
//             setLoading(true);
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//                 const { data } = await axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
//                 setComplaints(data);
//             } catch (error) {
//                 console.error("Failed to fetch complaints for dashboard:", error);
//                 toast.error("Could not load map data.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchComplaints();
//     }, [auth]);

//     return (
//         <Box>
//             <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
//                 Admin Dashboard
//             </Typography>

//             <Card sx={{ mt: 2 }}>
//                 <Box sx={{ p: 2 }}>
//                     <Typography variant="h6" gutterBottom>
//                         Live Map of Active Complaints
//                     </Typography>
//                 </Box>
                
//                 {/* Map Component */}
//                 {loading ? (
//                     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '500px' }}>
//                         <CircularProgress />
//                         <Typography sx={{ ml: 2 }}>Loading map...</Typography>
//                     </Box>
//                 ) : (
//                     <ComplaintsMap complaints={complaints} />
//                 )}
//             </Card>

//             {/* Quick Actions aur baaki ka content aap yahan add kar sakte ho */}
            
//         </Box>
//     );
// };

// export default AdminDashboard;





import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress } from '@mui/material';
import { Assignment, People, Engineering, ReportProblem } from '@mui/icons-material';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 2, height: '100%' }}>
        <Box sx={{ bgcolor: color, color: 'white', p: 2, borderRadius: '50%', mr: 2, display: 'flex', alignItems: 'center' }}>
            {icon}
        </Box>
        <Box>
            <Typography color="text.secondary">{title}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
        </Box>
    </Card>
);

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
                
                // Teeno API calls ek saath shuru karo
                const complaintsPromise = axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
                const citizensPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_CITIZEN`, config);
                const agentsPromise = axios.get(`${API_BASE_URL}/admin/users?role=ROLE_AGENT`, config);

                // Teeno ke poora hone ka wait karo
                const [complaintsRes, citizensRes, agentsRes] = await Promise.all([complaintsPromise, citizensPromise, agentsPromise]);

                // Data process karo
                const allComplaints = complaintsRes.data;
                const activeComplaints = allComplaints.filter(c => c.status === 'New' || c.status === 'In-Progress').length;
                
                const allAgents = agentsRes.data;
                // 'availabilityStatus' ko 'AVAILABLE' ya 'ON_DUTY' check kar sakte hain
                const agentsOnDuty = allAgents.filter(a => a.availabilityStatus === 'ON_DUTY').length;

                setStats({
                    totalComplaints: allComplaints.length,
                    activeComplaints: activeComplaints,
                    totalCitizens: citizensRes.data.length,
                    agentsOnDuty: agentsOnDuty,
                });

            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
                // Handle error state if needed
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, [auth]);

    const statCards = [
        { title: 'Total Complaints', value: stats.totalComplaints, icon: <Assignment />, color: 'primary.main' },
        { title: 'Active Complaints', value: stats.activeComplaints, icon: <ReportProblem color="error" />, color: 'error.main' },
        { title: 'Total Citizens', value: stats.totalCitizens, icon: <People />, color: 'success.main' },
        { title: 'Agents on Duty', value: stats.agentsOnDuty, icon: <Engineering />, color: 'warning.main' },
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {statCards.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <StatCard {...stat} />
                    </Grid>
                ))}
            </Grid>

            {/* --- CHARTS SECTION (Future work) --- */}
            {/* ... Charts ka code yahan aayega ... */}
        </Box>
    );
};

export default AdminDashboard;