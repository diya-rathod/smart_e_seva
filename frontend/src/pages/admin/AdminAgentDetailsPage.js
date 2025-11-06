import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, CircularProgress,
    Divider, Button, Grid, TextField, Avatar, IconButton, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle // <-- Naye imports
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    ArrowBack as ArrowBackIcon,
    LockReset as LockResetIcon,
    MoreVert as MoreVertIcon,
    Visibility as ViewIcon,
    Block as DeactivateIcon
} from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AdminAgentDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAgent, setEditedAgent] = useState(null);
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [anchorEl, setAnchorEl] = useState(null); // Menu ke liye
    const [selectedAgent, setSelectedAgent] = useState(null); // Selected agent ko yaad rakhne ke liye (Temporary)
    const [dialogOpen, setDialogOpen] = useState(false); // Confirmation dialog ke liye
    // Note: Reset Password modal ka logic yahan add nahi kiya hai, baad mein kar sakte hain.

    useEffect(() => {
        const fetchAgentDetails = async () => {
            if (!auth || !auth.token || !id) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/users/${id}`, config);
                setAgent(data);
                setEditedAgent({ ...data });
            } catch (error) {
                toast.error("Could not load agent data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgentDetails();
    }, [id, auth]);

    const handleInputChange = (e) => {
        setEditedAgent(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    };

    const handleSaveChanges = async () => {
        if (!editedAgent) return;
        const toastId = toast.loading('Saving changes...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const updatePayload = {
                name: editedAgent.name,
                email: editedAgent.email,
                mobileNumber: editedAgent.mobileNumber,
                employeeId: editedAgent.employeeId,
                division: editedAgent.division
            };
            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, updatePayload, config);
            setAgent(data);
            setEditedAgent({ ...data });
            setIsEditing(false);
            toast.success('Agent details updated!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save changes.', { id: toastId });
        }
    };

    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long."); return;
        }
        if (!agent) return;

        const toastId = toast.loading('Resetting password...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.put(`${API_BASE_URL}/admin/users/${id}`, { newPassword: newPassword }, config);

            toast.success('Password reset successfully!', { id: toastId });
            setNewPassword('');
            setResetModalOpen(false);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reset password.', { id: toastId });
        }
    };

    const handleConfirmDeactivate = async () => {
        // Ab 'selectedAgent' ki jagah 'agent' state use karenge
        if (!agent) return; 
        
        const toastId = toast.loading(`Updating agent status...`);
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const newStatus = agent.status === 'Active' ? 'Inactive' : 'Active';
            // Wahi status update API use hogi
            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, { status: newStatus }, config); // Use main user update API

            setAgent(data); // Update main state
            setEditedAgent({ ...data }); // Update edit state
            toast.success(`Agent ${newStatus === 'Active' ? 'activated' : 'deactivated'}!`, { id: toastId });

        } catch (error) {
            toast.error('Failed to update status.', { id: toastId });
            console.error("Status update failed:", error);
        } finally {
            setDialogOpen(false); // Dialog band karo
        }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (!agent) {
        return <Typography color="error">Agent not found or failed to load.</Typography>;
    }

    const displayData = editedAgent || {};

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate('/admin/manage-agents')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Agent Details
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar sx={{ width: 100, height: 100, fontSize: '3rem' }}>
                                {agent?.name ? agent.name.charAt(0).toUpperCase() : 'A'}
                            </Avatar>
                        </Grid>

                        <Grid xs={12} md={6}><TextField fullWidth label="Full Name" name="name" value={displayData.name || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12} md={6}><TextField fullWidth label="Email Address" name="email" value={displayData.email || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12} md={6}><TextField fullWidth label="Phone Number" name="mobileNumber" value={displayData.mobileNumber || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12} md={6}><TextField fullWidth label="Employee ID" name="employeeId" value={displayData.employeeId || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12}><TextField fullWidth label="Division" name="division" value={displayData.division || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            {!isEditing && (
                                <Button
                                    variant="outlined"
                                    color="warning"
                                    onClick={() => setResetModalOpen(true)}
                                    startIcon={<LockResetIcon />}
                                    sx={{ mr: 2 }}
                                >
                                    Reset Password
                                </Button>
                            )}
                            {!isEditing && agent && ( // Check karo ki agent data hai
                                <Button 
                                    variant="outlined" 
                                    // Color badlo status ke hisab se
                                    color={agent.status === 'Active' ? "error" : "success"} 
                                    onClick={() => setDialogOpen(true)} // Confirmation dialog kholega
                                    startIcon={<DeactivateIcon />}
                                >
                                    {/* Text badlo status ke hisab se */}
                                    {agent.status === 'Active' ? 'Deactivate Agent' : 'Activate Agent'}
                                </Button>
                            )}
                        </Box>
                        <Box>
                            {isEditing ? (
                                <>
                                    <Button onClick={() => { setIsEditing(false); setEditedAgent({ ...agent }); }} sx={{ mr: 1 }}>Cancel</Button>
                                    <Button variant="contained" onClick={handleSaveChanges} startIcon={<SaveIcon />}>Save Changes</Button>
                                </>
                            ) : (
                                <Button variant="outlined" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>Edit Details</Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={isResetModalOpen} onClose={() => setResetModalOpen(false)}>
                <DialogTitle>Reset Agent Password</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter the new password for {agent?.name} ({agent?.email}).
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="newPassword"
                        label="New Password"
                        type="password"
                        fullWidth
                        variant="standard"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPassword} variant="contained" color="warning">Reset Password</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to {agent?.status === 'Active' ? 'deactivate' : 'activate'} the agent "{agent?.name}"?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDeactivate} color={agent?.status === 'Active' ? "error" : "success"} autoFocus>
                        Confirm {agent?.status === 'Active' ? 'Deactivation' : 'Activation'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminAgentDetailsPage;