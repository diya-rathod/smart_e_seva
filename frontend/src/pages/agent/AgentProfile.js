import React, { useState, useEffect, useContext } from 'react';
import { 
    Box, Grid, Card, CardHeader, CardContent, TextField, Button, 
    Typography, Divider, Avatar, CircularProgress, Tooltip, IconButton
} from '@mui/material';
// Icons ki zaroorat nahi
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext'; // Path check kar lena

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const AgentProfile = () => {
    const { auth } = useContext(AuthContext);
    const [profile, setProfile] = useState({ name: '', email: '', mobileNumber: '', employeeId: '', division: '' }); // Agent fields add ki
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showPasswordFields, setShowPasswordFields] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/users/me`, config);
                setProfile({
                    name: data.name || '',
                    email: data.email || '',
                    mobileNumber: data.mobileNumber || '',
                    employeeId: data.employeeId || '', // Fetch agent specific data
                    division: data.division || ''     // Fetch agent specific data
                });
            } catch (error) {
                console.error("Failed to fetch profile:", error);
                toast.error("Could not load your profile data.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [auth.token]);

    const handlePasswordChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        // Password change logic (same as Admin)
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!"); return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long."); return;
        }
        const toastId = toast.loading('Changing password...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.post(`${API_BASE_URL}/users/change-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword
            }, config);
            toast.success('Password changed successfully!', { id: toastId });
            setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordFields(false);
        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error(error.response?.data?.message || 'Failed to change password.', { id: toastId });
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', aligs: 'center', height: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Agent Profile & Settings
            </Typography>

            <Grid container spacing={3}>
                {/* --- LEFT COLUMN --- */}
                <Grid xs={12} md={8}>
                    {/* 1. Personal Information */}
                    <Card>
                        <CardHeader title="Personal Information" />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <TextField fullWidth label="Full Name" value={profile.name} disabled InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField fullWidth label="Email Address" value={profile.email} disabled InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField fullWidth label="Phone Number" value={profile.mobileNumber} disabled InputProps={{ readOnly: true }} />
                                </Grid>
                                {/* --- AGENT SPECIFIC FIELDS --- */}
                                <Grid xs={12} md={6}>
                                    <TextField fullWidth label="Employee ID" value={profile.employeeId} disabled InputProps={{ readOnly: true }} />
                                </Grid>
                                <Grid xs={12} md={6}>
                                    <TextField fullWidth label="Division" value={profile.division} disabled InputProps={{ readOnly: true }} />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* 2. Security */}
                    {!showPasswordFields && (
                        <Box sx={{ mt: 3 }}>
                            <Button variant="contained" onClick={() => setShowPasswordFields(true)}>
                                Change Password
                            </Button>
                        </Box>
                    )}
                    {showPasswordFields && (
                         <Card component="form" onSubmit={handleChangePassword} sx={{ mt: 3 }}>
                            <CardHeader title="Security" />
                            <Divider />
                            <CardContent>
                                <Grid container spacing={2}>
                                    <Grid xs={12}><TextField fullWidth required type="password" label="Current Password" name="currentPassword" value={passwords.currentPassword} onChange={handlePasswordChange} /></Grid>
                                    <Grid xs={12} md={6}><TextField fullWidth required type="password" label="New Password" name="newPassword" value={passwords.newPassword} onChange={handlePasswordChange} /></Grid>
                                    <Grid xs={12} md={6}><TextField fullWidth required type="password" label="Confirm New Password" name="confirmPassword" value={passwords.confirmPassword} onChange={handlePasswordChange} /></Grid>
                                </Grid>
                            </CardContent>
                            <Divider />
                            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={() => setShowPasswordFields(false)} sx={{ mr: 1 }}>Cancel</Button>
                                <Button type="submit" variant="contained">Change Password</Button>
                            </Box>
                        </Card>
                    )}
                </Grid>

                {/* --- RIGHT COLUMN --- */}
                <Grid xs={12} md={4}>
                    {/* 3. Profile Picture */}
                     <Card>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', aligs: 'center' }}>
                            <Avatar sx={{ width: 100, height: 100, mb: 2, fontSize: '3rem' }}>
                                {profile.name ? profile.name.charAt(0).toUpperCase() : 'A'}
                            </Avatar>
                            <Typography variant="h6">{profile.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
                            <Button variant="contained" component="label" sx={{ mt: 2 }}>
                                Upload Picture
                                <input type="file" hidden />
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AgentProfile;