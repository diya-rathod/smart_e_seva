import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, CardContent, CircularProgress,
    Divider, Button, Grid, TextField, Avatar, IconButton, Tooltip,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, ArrowBack as ArrowBackIcon, LockReset as LockResetIcon, Block as DeactivateIcon } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const AdminAdminDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedAdmin, setEditedAdmin] = useState(null);
    const [isResetModalOpen, setResetModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false); // For Deactivate

    useEffect(() => {
        const fetchAdminDetails = async () => {
            if (!auth || !auth.token || !id) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/users/${id}`, config);
                setAdmin(data);
                setEditedAdmin({ ...data });
            } catch (error) { toast.error("Could not load admin data."); }
            finally { setLoading(false); }
        };
        fetchAdminDetails();
    }, [id, auth]);

    const handleInputChange = (e) => {
        setEditedAdmin(prev => prev ? { ...prev, [e.target.name]: e.target.value } : null);
    };

    const handleSaveChanges = async () => {
        if (!editedAdmin) return;
        const toastId = toast.loading('Saving changes...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const updatePayload = { name: editedAdmin.name, email: editedAdmin.email, mobileNumber: editedAdmin.mobileNumber };
            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, updatePayload, config);
            setAdmin(data);
            setEditedAdmin({ ...data });
            setIsEditing(false);
            toast.success('Admin details updated!', { id: toastId });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save changes.', { id: toastId });
        }
    };
    
    const handleResetPassword = async () => {
        if (!newPassword || newPassword.length < 6) { toast.error("Password must be at least 6 characters long."); return; }
        const toastId = toast.loading('Resetting password...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.put(`${API_BASE_URL}/admin/users/${id}`, { newPassword: newPassword }, config);
            toast.success('Password reset successfully!', { id: toastId });
            setNewPassword('');
            setResetModalOpen(false);
        } catch (error) { toast.error(error.response?.data?.message || 'Failed to reset.', { id: toastId });}
    };
    
    const handleConfirmDeactivate = async () => {
        if (!admin) return;
        const toastId = toast.loading('Updating status...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const newStatus = admin.status === 'Active' ? 'Inactive' : 'Active';
            const { data } = await axios.put(`${API_BASE_URL}/admin/users/${id}`, { status: newStatus }, config);
            setAdmin(data);
            setEditedAdmin({ ...data });
            toast.success(`Admin ${newStatus.toLowerCase()}d!`, { id: toastId });
        } catch (error) { toast.error('Failed to update status.', { id: toastId });}
        finally { setDialogOpen(false); }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    if (!admin) return <Typography color="error">Admin not found.</Typography>;

    const displayData = editedAdmin || {};

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={() => navigate('/admin/manage-admins')} sx={{ mr: 1 }}><ArrowBackIcon /></IconButton>
                <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Admin Details</Typography>
            </Box>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar sx={{ width: 100, height: 100, fontSize: '3rem' }}>{admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}</Avatar>
                        </Grid>
                        <Grid xs={12} md={6}><TextField fullWidth label="Full Name" name="name" value={displayData.name || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12} md={6}><TextField fullWidth label="Email Address" name="email" value={displayData.email || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                        <Grid xs={12}><TextField fullWidth label="Phone Number" name="mobileNumber" value={displayData.mobileNumber || ''} onChange={handleInputChange} disabled={!isEditing} /></Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {!isEditing && (<>
                                <Button variant="outlined" color="warning" onClick={() => setResetModalOpen(true)} startIcon={<LockResetIcon />}>Reset Password</Button>
                                <Button variant="outlined" color={admin.status === 'Active' ? "error" : "success"} onClick={() => setDialogOpen(true)} startIcon={<DeactivateIcon />}>{admin.status === 'Active' ? 'Deactivate' : 'Activate'}</Button>
                            </>)}
                        </Box>
                        <Box>
                            {isEditing ? (<>
                                <Button onClick={() => { setIsEditing(false); setEditedAdmin({ ...admin }); }} sx={{ mr: 1 }}>Cancel</Button>
                                <Button variant="contained" onClick={handleSaveChanges} startIcon={<SaveIcon />}>Save Changes</Button>
                            </>) : (
                                <Button variant="outlined" onClick={() => setIsEditing(true)} startIcon={<EditIcon />}>Edit Details</Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            <Dialog open={isResetModalOpen} onClose={() => setResetModalOpen(false)}>
                <DialogTitle>Reset Admin Password</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>Enter new password for {admin?.name}.</DialogContentText>
                    <TextField autoFocus margin="dense" name="newPassword" label="New Password" type="password" fullWidth variant="standard" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetModalOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPassword} variant="contained" color="warning">Reset</Button>
                </DialogActions>
            </Dialog>
            
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Confirm Action</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to {admin?.status === 'Active' ? 'deactivate' : 'activate'} "{admin?.name}"?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDeactivate} color={admin?.status === 'Active' ? "error" : "success"} autoFocus>Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminAdminDetailsPage;