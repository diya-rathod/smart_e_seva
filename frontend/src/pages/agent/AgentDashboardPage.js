// //frontend/src/pages/agent/AgentDashboardPage.js

// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import { Link } from 'react-router-dom';

// const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// const AgentDashboardPage = () => {
//   const { auth } = useContext(AuthContext);
//   const [assignedComplaints, setAssignedComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [agentDetails, setAgentDetails] = useState({}); // FIX 1: Set initial state to empty object
//   const [sseConnection, setSseConnection] = useState(null);

//   const config = {
//     headers: {
//       'Authorization': `Bearer ${auth.token}`
//     }
//   };

//   // --- 1. Fetch Agent Details and Assigned Complaints ---
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!auth.token) {
//         setLoading(false);
//         return;
//       }

//       try {
//         const userResponse = await axios.get(`${API_BASE_URL}/users/me`, config);
//         setAgentDetails(userResponse.data);

//         const complaintsResponse = await axios.get(`${API_BASE_URL}/agent/my-complaints`, config);
//         setAssignedComplaints(complaintsResponse.data);

//       } catch (error) {
//         console.error("Failed to fetch agent data:", error);
//         toast.error("Failed to load dashboard data.");
//         setAgentDetails({}); // Set empty object on error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();

//     if ("geolocation" in navigator) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           console.log("Location Permission Granted!");
//         },
//         (error) => {
//           console.warn("Location Permission Denied/Error:", error);
//           // toast.error("Please allow location access for navigation."); // Toast ko hata dete hain taki woh prompt ko disturb na kare
//         },
//         // FIX: options object add karte hain taaki browser ko prompt dikhana pade
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 0 // Koi cached location use na ho
//         }
//       );
//     }

//   }, [auth.token]);


//   // --- 2. SSE Listener Setup for Real-time Assignment ---
//   useEffect(() => {
//     if (!auth.email || !auth.token) return;

//     // FIX 2: SSE URL mein token query param se bhej rahe hain
//     const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;

//     if (sseConnection) {
//       sseConnection.close();
//       setSseConnection(null);
//     }

//     const eventSource = new EventSource(sseUrl);
//     setSseConnection(eventSource);

//     eventSource.onopen = () => {
//       console.log("SSE Connection established for Agent.");
//     };

//     eventSource.addEventListener("agent_assigned", (event) => {
//       const newAssignment = JSON.parse(event.data);

//       if (newAssignment.agent && newAssignment.agent.email === auth.email) {
//         toast.success(`🎉 NEW COMPLAINT ASSIGNED: ${newAssignment.ticketId}!`);

//         setAssignedComplaints(prevComplaints => [newAssignment, ...prevComplaints]);
//       }
//     });

//     eventSource.onerror = (err) => {
//       console.error("EventSource failed for Agent:", err);
//       eventSource.close();
//       setSseConnection(null);
//     };

//     // Cleanup
//     return () => {
//       console.log("Closing SSE Connection for Agent.");
//       eventSource.close();
//     };

//   }, [auth.email, auth.token]);


//   if (loading) {
//     return <p>Loading Agent Dashboard...</p>;
//   }

//   // FIX 3: Robust check for agentDetails
//   if (!agentDetails || !agentDetails.id) {
//     return <p>Error: Could not load Agent details. Please log in again.</p>;
//   }

//   const totalAssigned = assignedComplaints.length;
//   const pendingCount = assignedComplaints.filter(c => c.status !== 'Resolved').length;

//   return (
//     <div style={{ padding: '20px' }}>
//       <h1>Agent Dashboard: {agentDetails.name}</h1>
//       <p><strong>Employee ID:</strong> {agentDetails.employeeId} |
//         <strong>Division:</strong> {agentDetails.division} |
//         <strong>Status:</strong> <span style={{ color: pendingCount > 0 ? 'red' : 'green', fontWeight: 'bold' }}>{pendingCount > 0 ? 'ON DUTY' : 'AVAILABLE'}</span></p>

//       <div style={{ display: 'flex', gap: '20px', margin: '20px 0' }}>
//         <div style={cardStyle}>
//           <h3>Total Assigned: {totalAssigned}</h3>
//         </div>
//         <div style={cardStyle}>
//           <h3>Pending Complaints: {pendingCount}</h3>
//         </div>
//       </div>

//       <h2>My Assigned Complaints ({pendingCount})</h2>
//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '15px' }}>
//         <thead>
//           <tr style={{ backgroundColor: '#f2f2f2' }}>
//             <th style={tableHeaderStyle}>Ticket ID</th>
//             <th style={tableHeaderStyle}>Category</th>
//             <th style={tableHeaderStyle}>Location</th>
//             <th style={tableHeaderStyle}>Status</th>
//             <th style={tableHeaderStyle}>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {assignedComplaints.length > 0 ? (
//             assignedComplaints.map(complaint => (
//               <tr key={complaint.id}>
//                 <td style={tableCellStyle}>{complaint.ticketId}</td>
//                 <td style={tableCellStyle}>{complaint.category}</td>
//                 <td style={tableCellStyle}>{complaint.location ? complaint.location.substring(0, 30) + '...' : 'N/A'}</td>
//                 <td style={{ ...tableCellStyle, color: complaint.status === 'Resolved' ? 'green' : 'red', fontWeight: 'bold' }}>{complaint.status}</td>
//                 <td style={tableCellStyle}>
//                   <Link to={`/agent/complaint/${complaint.id}`} style={{ color: '#007bff' }}>View/Update</Link>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan="5" style={{ ...tableCellStyle, textAlign: 'center' }}>You have no complaints assigned yet. Enjoy your break! (Status: AVAILABLE)</td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // Simple inline styling for table
// const tableHeaderStyle = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' };
// const tableCellStyle = { padding: '10px', textAlign: 'left', borderBottom: '1px solid #eee' };
// const cardStyle = { padding: '20px', border: '1px solid #ccc', borderRadius: '8px', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };

    
// export default AgentDashboardPage;





import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { 
    Box, Card, CardContent, Typography, Grid, Switch, FormControlLabel, 
    Chip, Container, Paper, Avatar, IconButton, Divider, Button
} from '@mui/material';
import { 
    Assignment, PendingActions, CheckCircle, LocationOn, 
    Engineering, Refresh, ArrowForward
} from '@mui/icons-material';

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const AgentDashboardPage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [assignedComplaints, setAssignedComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [agentDetails, setAgentDetails] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };

  const fetchData = async () => {
    if (!auth.token) return;
    try {
      setLoading(true);
      const userRes = await axios.get(`${API_BASE_URL}/users/me`, config);
      setAgentDetails(userRes.data);
      setIsAvailable(userRes.data.availabilityStatus === 'AVAILABLE');

      const complaintsRes = await axios.get(`${API_BASE_URL}/agent/my-complaints`, config);
      setAssignedComplaints(complaintsRes.data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [auth.token]);

  const handleStatusToggle = async () => {
    setStatusLoading(true);
    try {
        const res = await axios.put(`${API_BASE_URL}/agent/toggle-status`, {}, config);
        const newStatus = res.data.status;
        setIsAvailable(newStatus === 'AVAILABLE');
        toast.success(newStatus === 'AVAILABLE' ? "You are ON DUTY" : "You are OFF DUTY");
    } catch (error) {
        toast.error("Failed to update status");
    } finally {
        setStatusLoading(false);
    }
  };

  if (loading) return <p style={{textAlign:'center', marginTop: '20px'}}>Loading Dashboard...</p>;

  const pendingCount = assignedComplaints.filter(c => c.status !== 'Resolved').length;
  const resolvedCount = assignedComplaints.filter(c => c.status === 'Resolved').length;

  return (
    <Box sx={{ backgroundColor: '#f5f7fa', minHeight: '100vh', pb: 5 }}>
        
        {/* --- 1. PROFESSIONAL HEADER --- */}
        <Paper elevation={0} sx={{ 
            background: 'white', 
            p: 3, 
            borderBottom: '1px solid #e0e0e0',
            mb: 4
        }}>
            <Container maxWidth="lg">
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: '#0056b3', width: 60, height: 60, fontSize: '1.5rem' }}>
                            {agentDetails.name ? agentDetails.name.charAt(0) : 'A'}
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold" color="#333">
                                {agentDetails.name}
                            </Typography>
                            <Box display="flex" gap={1} alignItems="center">
                                <Chip label={agentDetails.division} size="small" color="primary" variant="outlined"/>
                                <Typography variant="body2" color="text.secondary">
                                    ID: {agentDetails.employeeId}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>

                    <Grid item>
                         <Paper elevation={0} sx={{ border: '1px solid #ddd', p: 0.5, px: 2, borderRadius: '30px' }}>
                            <FormControlLabel
                                control={
                                    <Switch 
                                        checked={isAvailable} 
                                        onChange={handleStatusToggle} 
                                        disabled={statusLoading}
                                        color="success" 
                                    />
                                }
                                label={
                                    <Typography fontWeight="bold" fontSize="0.9rem" color={isAvailable ? 'green' : 'text.disabled'}>
                                        {isAvailable ? "ON DUTY" : "OFF DUTY"}
                                    </Typography>
                                }
                                sx={{ m: 0 }}
                            />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Paper>

        <Container maxWidth="lg">
            
            {/* --- 2. STATS CARDS (BIGGER & BETTER) --- */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        icon={<Assignment sx={{ fontSize: 40, color: '#1976d2' }} />} 
                        title="Total Assigned" 
                        value={assignedComplaints.length}
                        color="#e3f2fd"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        icon={<PendingActions sx={{ fontSize: 40, color: '#ed6c02' }} />} 
                        title="Pending Jobs" 
                        value={pendingCount} 
                        color="#fff3e0"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <StatCard 
                        icon={<CheckCircle sx={{ fontSize: 40, color: '#2e7d32' }} />} 
                        title="Jobs Resolved" 
                        value={resolvedCount} 
                        color="#e8f5e9"
                    />
                </Grid>
            </Grid>

            {/* --- 3. JOB LIST SECTION --- */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: '#333' }}>
                    Current Active Jobs
                </Typography>
                <Button startIcon={<Refresh />} onClick={fetchData} size="small">
                    Refresh List
                </Button>
            </Box>

            {assignedComplaints.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center', color: 'gray', borderRadius: '12px', border: '1px dashed #ccc' }}>
                    <Typography variant="h6">No jobs assigned currently.</Typography>
                    <Typography variant="body2">Relax! You are all caught up.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {assignedComplaints.map((complaint) => (
                        <Grid item xs={12} key={complaint.id}>
                            <Card 
                                sx={{ 
                                    borderRadius: '12px', 
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                                    borderLeft: `6px solid ${getStatusColor(complaint.status)}`,
                                    transition: '0.2s',
                                    '&:hover': { boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }
                                }}
                            >
                                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                                    <Grid container alignItems="center" spacing={2}>
                                        
                                        {/* Left: Ticket & Status */}
                                        <Grid item xs={12} md={3}>
                                            <Chip 
                                                label={complaint.ticketId} 
                                                sx={{ mb: 1, fontWeight: 'bold', borderRadius: '6px' }} 
                                            />
                                            <Typography 
                                                variant="subtitle2" 
                                                fontWeight="bold" 
                                                sx={{ color: getStatusColor(complaint.status) }}
                                            >
                                                ● {complaint.status.toUpperCase()}
                                            </Typography>
                                        </Grid>

                                        {/* Middle: Details */}
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                                {complaint.category}
                                            </Typography>
                                            <Box display="flex" alignItems="flex-start" gap={1}>
                                                <LocationOn sx={{ color: 'gray', fontSize: 20, mt: 0.3 }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {complaint.location || 'Location details not available'}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        {/* Right: Action Button */}
                                        <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                                            <Button 
                                                variant="contained" 
                                                disableElevation
                                                endIcon={<ArrowForward />}
                                                onClick={() => navigate(`/agent/complaint/${complaint.id}`)}
                                                sx={{ 
                                                    borderRadius: '8px', 
                                                    textTransform: 'none', 
                                                    bgcolor: '#0056b3',
                                                    '&:hover': { bgcolor: '#004494' }
                                                }}
                                            >
                                                View Details
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    </Box>
  );
};

// --- HELPER COMPONENTS ---

const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2, borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Avatar sx={{ bgcolor: color, width: 60, height: 60, mr: 2 }}>
            {icon}
        </Avatar>
        <Box>
            <Typography variant="h4" fontWeight="bold" color="#333">{value}</Typography>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
        </Box>
    </Card>
);

const getStatusColor = (status) => {
    switch(status) {
        case 'Resolved': return '#2e7d32'; // Green
        case 'In-Progress': return '#ed6c02'; // Orange
        case 'Assigned': return '#0288d1'; // Blue
        default: return '#757575'; // Grey
    }
};

export default AgentDashboardPage;