// import React, { useState, useEffect, useContext } from 'react';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';
// import { Link } from 'react-router-dom';
// import Modal from '../../components/ui/Modal';
// import AssignmentLogicComponent from './AssignmentLogicComponent';
// // We can create a new CSS file for this page
// // import './ManageComplaintsPage.css'; 

// const ManageComplaintsPage = () => {
//     const [complaints, setComplaints] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { auth } = useContext(AuthContext);

//     const [assignmentModal, setAssignmentModal] = useState({ isOpen: false, complaint: null });

//     useEffect(() => {
//         const fetchComplaints = async () => {
//             if (!auth || !auth.token) {
//                 setLoading(false);
//                 return;
//             }
//             try {
//                 const config = {
//                     headers: { 'Authorization': `Bearer ${auth.token}` }
//                 };
//                 const response = await axios.get('http://localhost:8080/api/v1/admin/all-complaints', config);
//                 setComplaints(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch complaints:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchComplaints();
//     }, [auth]); // Re-run if auth state changes

//     const handleAssignClick = (complaint) => {
//         // Sirf un complaints ko assign karne den jinko pehle assign nahi kiya gaya hai
//         if (complaint.status === 'New' && !complaint.agent) {
//             setAssignmentModal({ isOpen: true, complaint: complaint });
//         } else {
//              // Already assigned ya resolved complaint ko dobara assign nahi kar sakte
//              alert(`Complaint ${complaint.status} hai ya already assigned hai.`);
//         }
//     };


//     const handleAssignmentSuccess = (updatedComplaint) => {
//         // Complaint list ko update karein (for UI sync)
//         setComplaints(prev => prev.map(c => 
//             c.id === updatedComplaint.id ? updatedComplaint : c
//         ));
//         setAssignmentModal({ isOpen: false, complaint: null });
//     };
    
//     const handleModalClose = () => {
//         setAssignmentModal({ isOpen: false, complaint: null });
//     };

//     if (loading) {
//         return <p>Loading complaints...</p>;
//     }

//     return (
//         <div>
//             <h1>Manage All Complaints</h1>
//             <div className="page-content-card">
//                 {complaints.length === 0 ? (
//                     <p>No complaints found in the system.</p>
//                 ) : (
//                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
//                         <thead>
//                             <tr style={{ borderBottom: '2px solid #dee2e6' }}>
//                                 <th style={{ padding: '12px', textAlign: 'left' }}>Ticket ID</th>
//                                 <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
//                                 <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
//                                 <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                                 {complaints.map(complaint => (
//                                 <tr key={complaint.id}>
//                                     <td>{complaint.ticketId}</td>
//                                     <td>{complaint.category}</td>
//                                     <td>
//                                         <span style={{ color: complaint.status === 'New' ? 'red' : 'green', fontWeight: 'bold' }}>
//                                             {complaint.status}
//                                         </span>
//                                     </td>
//                                     <td>
//                                         {/* View Link */}
//                                         <Link to={`/admin/complaints/${complaint.id}`} className="btn-link">View</Link>
                                        
//                                         {/* Assign Button/Link */}
//                                         {complaint.status === 'New' && !complaint.agent && complaint.latitude && complaint.longitude ? (
//                                             <>
//                                                 &nbsp;/&nbsp;
//                                                 <span 
//                                                     onClick={() => handleAssignClick(complaint)} 
//                                                     style={{ cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
//                                                 >
//                                                     Assign
//                                                 </span>
//                                             </>
//                                         ) : (
//                                             // Agar complaint already assigned hai toh Agent ka email dikhayein
//                                             complaint.agent ? ` (Assigned to: ${complaint.agent.email})` : null
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 )}
//             </div>

//             {assignmentModal.isOpen && assignmentModal.complaint && (
//                 <Modal 
//                     isOpen={assignmentModal.isOpen} 
//                     onClose={handleModalClose} 
//                     title={`Assign Agent to ${assignmentModal.complaint.ticketId}`}
//                 >
//                     <AssignmentLogicComponent 
//                         complaint={assignmentModal.complaint} 
//                         onAssignmentSuccess={handleAssignmentSuccess} // Success handler
//                         hideConfirmButton={true}
//                     />
//                 </Modal>
//             )}
//         </div>
//     );
// };

// export default ManageComplaintsPage;



import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Card, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, Chip, Button, CircularProgress,
    TextField, Grid // TextField aur Grid ko import karo
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ManageComplaintsPage = () => {
    const { auth } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]); // Original list
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- NAYE STATES SEARCH KE LIYE ---
    const [searchId, setSearchId] = useState('');
    const [searchEmail, setSearchEmail] = useState('');

    // --- 1. Fetch ALL complaints ---
    useEffect(() => {
        const fetchComplaints = async () => {
            if (!auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
                
                // --- YAHAN KOI FILTERING NAHI HAI ---
                // Saari complaints ko state mein save karo
                setComplaints(data);

            } catch (error) {
                console.error("Failed to fetch complaints:", error);
                toast.error("Could not load complaints data.");
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [auth.token]);

    // --- 2. SEARCH LOGIC ---
    const filteredComplaints = complaints.filter(complaint => {
        const ticketIdMatch = complaint.ticketId.toLowerCase().includes(searchId.toLowerCase());
        const emailMatch = complaint.citizen?.email.toLowerCase().includes(searchEmail.toLowerCase());
        return ticketIdMatch && emailMatch;
    });


    // Status ke hisaab se color dene ke liye function
    const getStatusChipColor = (status) => {
        if (status === 'New') return 'error';
        if (status === 'In-Progress') return 'warning';
        if (status === 'Resolved') return 'success'; // Green color for Resolved
        return 'default';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Manage All Complaints
            </Typography>

            <Card sx={{ p: 2 }}>
                {/* --- YEH NAYA SEARCH/FILTER SECTION HAI --- */}
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search by Ticket ID"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search by Citizen Email"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </Box>
                {/* --- SEARCH SECTION END --- */}

                <TableContainer>
                    <Table>
                        <TableHead>
                            {/* ... TableHead code same rahega ... */}
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Ticket ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Citizen Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Date Raised</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {/* Ab hum 'filteredComplaints' ko map karenge */}
                            {filteredComplaints.length > 0 ? (
                                filteredComplaints.map((complaint) => (
                                    <TableRow key={complaint.id} hover>
                                        <TableCell>{complaint.ticketId}</TableCell>
                                        <TableCell>{complaint.category}</TableCell>
                                        <TableCell>{complaint.citizen?.email || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={complaint.status} 
                                                color={getStatusChipColor(complaint.status)} 
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(complaint.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Button 
                                                variant="outlined" 
                                                size="small"
                                                onClick={() => navigate(`/admin/complaints/${complaint.id}`)}
                                            >
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">
                                        No complaints found matching your search.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
};

export default ManageComplaintsPage;