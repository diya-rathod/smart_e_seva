import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, CircularProgress,
    Divider, Button, Grid, TextField, Avatar, IconButton, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon, LockReset as LockResetIcon,Block as DeactivateIcon } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const AdminCitizenDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [citizen, setCitizen] = useState(null); // Original data from API
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // <-- YEH ADD KARO
    
    // --- YEH STATE EDIT KIYE JAANE WAALE DATA KO RAKHEGA ---
    const [editedCitizen, setEditedCitizen] = useState(null); 
    
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    // --- Fetch Citizen Details ---
    useEffect(() => {
        const fetchCitizenDetails = async () => {
            if (!auth || !auth.token || !id) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/users/${id}`, config);
                setCitizen(data);
                setEditedCitizen({ ...data }); // Initialize edit state with a COPY
            } catch (error) {
                console.error("Failed to fetch citizen details:", error);
                toast.error("Could not load citizen data.");
                setCitizen(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCitizenDetails();
    }, [id, auth]); // Removed editedCitizen from dependency

    // --- Input Change Handler (Updates only editedCitizen state) ---
    const handleInputChange = (e) => {
        // Ensure editedCitizen is not null before updating
        setEditedCitizen(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    };

    // --- Save Changes Handler ---
    const handleSaveChanges = async () => {
        // Check if editedCitizen has data
        if (!editedCitizen) {
            toast.error("Cannot save, data is missing.");
            return;
        }
        
        const toastId = toast.loading('Saving changes...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            
            // --- YEH PAYLOAD AB BILKUL SAHI HAI ---
            // Sirf wahi fields bhejenge jo DTO expect karta hai
            const updatePayload = {
                name: editedCitizen.name,
                email: editedCitizen.email,
                mobileNumber: editedCitizen.mobileNumber,
                meterNumber: editedCitizen.meterNumber,
                serviceAddress: editedCitizen.serviceAddress,
                landmark: editedCitizen.landmark
                // status aur newPassword yahan se nahi bhej rahe
            };

            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, updatePayload, config);
            
            setCitizen(data); // Update main state with response
            setEditedCitizen({ ...data }); // Update edit state with response
            setIsEditing(false); 
            toast.success('Citizen details updated successfully!', { id: toastId });
        } catch (error) {
            console.error("Failed to update citizen details:", error);
            toast.error(error.response?.data?.message || 'Failed to save changes.', { id: toastId });
        }
    };

     // --- Reset Password Handler ---
    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long."); return;
        }
        if (!citizen) return;

        const toastId = toast.loading('Resetting password...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            // Backend ko sirf 'newPassword' field bhej rahe hain
            await axios.put(`${API_BASE_URL}/admin/users/${id}`, { newPassword: newPassword }, config); 
            
            toast.success('Password reset successfully!', { id: toastId });
            setNewPassword(''); 
            setResetModalOpen(false); 

        } catch (error) {
            console.error("Failed to reset password:", error);
            toast.error(error.response?.data?.message || 'Failed to reset password.', { id: toastId });
        }
    };

    const handleConfirmDeactivate = async () => {
        if (!citizen) return;
        const toastId = toast.loading('Updating status...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const newStatus = citizen.status === 'Active' ? 'Inactive' : 'Active';
            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, { status: newStatus }, config);
            setCitizen(data);
            setEditedCitizen({ ...data });
            toast.success(`Citizen ${newStatus.toLowerCase()}d!`, { id: toastId });
        } catch (error) { toast.error('Failed to update status.', { id: toastId });}
        finally { setDialogOpen(false); }
    };

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}> <CircularProgress /></Box>;
    }

    if (!citizen) {
        return <Typography color="error">Citizen not found or failed to load.</Typography>;
    }

    // --- DISPLAY LOGIC BILKUL SAHI HAI ---
    // Hamesha 'editedCitizen' ki value dikhao, taaki changes dikhein
    // Agar 'editedCitizen' null hai (jo nahi hona chahiye load ke baad), to fallback '' use karo
    const displayData = editedCitizen || {}; 

    return (
        <Box>
            {/* --- Back Button and Title --- */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate('/admin/manage-citizens')} sx={{ mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    Citizen Details
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        {/* --- Profile Picture --- */}
                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar sx={{ width: 100, height: 100, fontSize: '3rem' }}>
                                {displayData?.name ? displayData.name.charAt(0).toUpperCase() : 'C'}
                            </Avatar>
                        </Grid>
                        
                        {/* --- Details (Editable based on isEditing state) --- */}
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Full Name" name="name" value={displayData?.name || ''} onChange={handleInputChange} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Email Address" name="email" value={displayData?.email || ''} onChange={handleInputChange} disabled={!isEditing} /> 
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Phone Number" name="mobileNumber" value={displayData?.mobileNumber || ''} onChange={handleInputChange} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Meter Number" name="meterNumber" value={displayData?.meterNumber || ''} onChange={handleInputChange} disabled={!isEditing} />
                        </Grid>
                        <Grid item xs={12}>
                             <TextField fullWidth label="Service Address" name="serviceAddress" value={displayData?.serviceAddress || ''} onChange={handleInputChange} disabled={!isEditing} />
                        </Grid>
                         <Grid item xs={12}>
                             <TextField fullWidth label="Landmark" name="landmark" value={displayData?.landmark || ''} onChange={handleInputChange} disabled={!isEditing} />
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {/* --- Action Buttons --- */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            {!isEditing && (<>
                                <Button 
                                    variant="outlined" 
                                    color="warning"
                                    onClick={() => setResetModalOpen(true)}
                                    startIcon={<LockResetIcon />}
                                    sx={{ mr: 2 }} 
                                >
                                    Reset Password
                                </Button>
                                <Button variant="outlined" color={citizen.status === 'Active' ? "error" : "success"} onClick={() => setDialogOpen(true)} startIcon={<DeactivateIcon />}>{citizen.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
                            </>)}
                        </Box>
                        <Box>
                            {isEditing ? (
                                <>
                                    <Button onClick={() => { setIsEditing(false); setEditedCitizen(citizen); }} sx={{ mr: 1 }}>Cancel</Button>
                                    <Button variant="contained" onClick={handleSaveChanges} startIcon={<SaveIcon />}>Save Changes</Button>
                                </>
                            ) : (
                                <Button variant="outlined" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>Edit Details</Button>
                            )}
                        </Box>
                    </Box> {/* <-- YEH CLOSING BOX MISSING THA */}
                </CardContent>
            </Card>

            {/* --- Reset Password Modal --- */}
            <Dialog open={isResetModalOpen} onClose={() => setResetModalOpen(false)}>
                <DialogTitle>Reset Citizen Password</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Enter the new password for {citizen?.name} ({citizen?.email}).
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
                    <DialogContentText>Are you sure you want to {citizen?.status === 'Active' ? 'deactivate' : 'activate'} "{citizen?.name}"?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDeactivate} color={citizen?.status === 'Active' ? "error" : "success"} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCitizenDetailsPage;