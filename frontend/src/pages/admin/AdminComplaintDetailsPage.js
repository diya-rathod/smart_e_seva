import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { 
    Box, Typography, Card, CardContent, CircularProgress, 
    Divider, Button, Grid, Chip 
} from '@mui/material'; // <-- MUI imports
import Modal from '../../components/ui/Modal'; // <-- Modal import
import AssignmentLogicComponent from './AssignmentLogicComponent'; // <-- Assignment logic import
import toast from 'react-hot-toast'; // <-- Toast import

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AdminComplaintDetailsPage = () => {
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    // --- NAYE STATES MODAL KE LIYE ---
    const [isAssignModalOpen, setAssignModalOpen] = useState(false);

    useEffect(() => {
        const fetchComplaintDetails = async () => {
            if (!auth || !auth.token) return;
            setLoading(true); // Start loading
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get(`${API_BASE_URL}/admin/complaints/${id}`, config);
                setComplaint(response.data);
            } catch (error) {
                console.error("Failed to fetch complaint details:", error);
                toast.error("Could not load complaint details."); // Add toast for error
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchComplaintDetails();
    }, [id, auth]);

    // --- NAYE FUNCTIONS MODAL KE LIYE ---
    const handleAssignClick = () => {
        if (complaint && complaint.status === 'New' && !complaint.agent && complaint.latitude && complaint.longitude) {
            setAssignModalOpen(true);
        } else {
            toast.error("Complaint cannot be assigned (already assigned, resolved, or location missing).");
        }
    };

    const handleAssignmentSuccess = (updatedComplaintData) => {
        setComplaint(updatedComplaintData); 
        setAssignModalOpen(false); 
        toast.success("Agent assigned successfully!"); 
    };

    const handleModalClose = () => {
        setAssignModalOpen(false);
    };

    // Status chip color
    const getStatusChipColor = (status) => {
        if (status === 'New') return 'error';
        if (status === 'In-Progress') return 'warning';
        if (status === 'Resolved') return 'success';
        return 'default';
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!complaint) {
        return <Typography color="error">Complaint not found.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Complaint Details: {complaint.ticketId}
            </Typography>
            
            <Grid container spacing={3}>
                {/* --- LEFT COLUMN: Complaint & Citizen Details --- */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Complaint Information</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Category:</strong> {complaint.category}</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}>
                                <strong>Status:</strong> 
                                <Chip 
                                    label={complaint.status} 
                                    color={getStatusChipColor(complaint.status)} 
                                    size="small" 
                                    sx={{ ml: 1 }} 
                                />
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Description:</strong> {complaint.description}</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Location:</strong> {complaint.location}</Typography>
                            <Typography variant="body1" sx={{ mb: 2 }}><strong>Landmark:</strong> {complaint.landmark || 'N/A'}</Typography>
                            
                            {/* --- ASSIGN AGENT BUTTON --- */}
                            {complaint.status === 'New' && !complaint.agent && complaint.latitude && complaint.longitude && (
                                <Box sx={{ mb: 2 }}>
                                    <Button 
                                        variant="contained" 
                                        color="primary"
                                        onClick={handleAssignClick}
                                    >
                                        Assign Agent
                                    </Button>
                                </Box>
                            )}
                            
                            <Divider sx={{ my: 2 }} /> 
                            
                            <Typography variant="h6" gutterBottom>Citizen Details</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Name:</strong> {complaint.citizen?.name || 'N/A'}</Typography>
                            <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {complaint.citizen?.email || 'N/A'}</Typography>
                            <Typography variant="body1"><strong>Mobile:</strong> {complaint.citizen?.mobileNumber || 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* --- RIGHT COLUMN: Agent Details (agar assigned hai) --- */}
                <Grid item xs={12} md={4}>
                    {complaint.agent ? (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Assigned Agent</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1" sx={{ mb: 1 }}><strong>Name:</strong> {complaint.agent.name}</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}><strong>Email:</strong> {complaint.agent.email}</Typography>
                                <Typography variant="body1" sx={{ mb: 1 }}><strong>Employee ID:</strong> {complaint.agent.employeeId}</Typography>
                                <Typography variant="body1"><strong>Division:</strong> {complaint.agent.division}</Typography>
                            </CardContent>
                        </Card>
                    ) : (
                         <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Agent Information</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography color="text.secondary">No agent assigned yet.</Typography>
                            </CardContent>
                         </Card>
                    )}
                    {/* Yahan baad mein complaint history/log add kar sakte hain */}
                </Grid>
            </Grid>

            {/* --- ASSIGN AGENT MODAL --- */}
            {isAssignModalOpen && complaint && (
                <Modal 
                    isOpen={isAssignModalOpen} 
                    onClose={handleModalClose} 
                    title={`Assign Agent to ${complaint.ticketId}`}
                    hideConfirmButton={true} 
                >
                    <AssignmentLogicComponent 
                        complaint={complaint} 
                        onAssignmentSuccess={handleAssignmentSuccess} 
                    />
                </Modal>
            )}
        </Box>
    );
};

export default AdminComplaintDetailsPage;