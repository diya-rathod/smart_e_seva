import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Card, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, Chip, IconButton, Menu, MenuItem, CircularProgress,
    TextField, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { MoreVert as MoreVertIcon, Visibility as ViewIcon, Block as DeactivateIcon } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext'; // Path check kar lena

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const ManageAdminsPage = () => {
    const { auth } = useContext(AuthContext);
    const [admins, setAdmins] = useState([]); // State ka naam badla
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // State for Search (Sirf Email)
    const [searchEmail, setSearchEmail] = useState('');

    // States for Action Menu & Dialog
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAdmin, setSelectedAdmin] = useState(null); // State ka naam badla
    const [dialogOpen, setDialogOpen] = useState(false);

    // --- 1. Fetch all admins ---
    useEffect(() => {
        const fetchAdmins = async () => {
            // Extra check: Agar user SUPER_ADMIN nahi hai to fetch na karein
            if (!auth || !auth.token || auth.role !== 'ROLE_SUPER_ADMIN') {
                setLoading(false);
                toast.error("Access Denied."); // Ya user ko redirect kar dein
                return;
            }
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                // API to get all users with ROLE_ADMIN
                const { data } = await axios.get(`${API_BASE_URL}/admin/users?role=ROLE_ADMIN`, config);
                setAdmins(data);
            } catch (error) {
                console.error("Failed to fetch admins:", error);
                toast.error("Could not load admin data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAdmins();
    }, [auth]); // Auth par depend karega

    // --- 2. Search Logic ---
    const filteredAdmins = admins.filter(admin => {
        return admin.email.toLowerCase().includes(searchEmail.toLowerCase());
    });

    // --- 3. Action Menu Handlers ---
    const handleMenuClick = (event, admin) => {
        setAnchorEl(event.currentTarget);
        setSelectedAdmin(admin);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAdmin(null);
    };

    // --- 4. Deactivate Logic ---
    const handleDeactivateClick = () => {
        setDialogOpen(true);
        handleMenuClose();
    };

    const handleConfirmDeactivate = async () => {
        if (!selectedAdmin) return;

        const toastId = toast.loading('Updating admin status...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const newStatus = selectedAdmin.status === 'Active' ? 'Inactive' : 'Active';
            // Wahi status update API use hogi
            await axios.put(`${API_BASE_URL}/admin/users/${selectedAdmin.id}/status`, { status: newStatus }, config);

            setAdmins(admins.map(a => a.id === selectedAdmin.id ? { ...a, status: newStatus } : a));
            toast.success(`Admin ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`, { id: toastId });

        } catch (error) {
            toast.error('Failed to update status.', { id: toastId });
        } finally {
            setDialogOpen(false);
        }
    };


    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    // Agar user SUPER_ADMIN nahi hai to page render na karein (optional extra check)
    if (auth?.role !== 'ROLE_SUPER_ADMIN') {
        return <Typography color="error">Access Denied: You do not have permission to view this page.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Manage Admins
            </Typography>

            <Card sx={{ p: 2 }}>
                {/* --- Search Filter (Sirf Email) --- */}
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid xs={12}> {/* Full width */}
                            <TextField fullWidth size="small" label="Search by Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                        </Grid>
                    </Grid>
                </Box>

                {/* --- Admins Table --- */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                {/* Admin ke liye extra columns ki zaroorat nahi */}
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAdmins.map((admin) => (
                                <TableRow key={admin.id} hover>
                                    <TableCell>{admin.name}</TableCell>
                                    <TableCell>{admin.email}</TableCell>
                                    <TableCell>
                                        <Chip label={admin.status} color={admin.status === 'Active' ? 'success' : 'error'} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuClick(e, admin)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* --- Action Menu --- */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={() => {
                        if (selectedAdmin) navigate(`/admin/admin/${selectedAdmin.id}`);
                        handleMenuClose();
                    }}>
                        <ViewIcon sx={{ mr: 1 }} /> View/Edit Details
                    </MenuItem>
                    <MenuItem onClick={handleDeactivateClick}>
                        <DeactivateIcon sx={{ mr: 1 }} />
                        {selectedAdmin?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </MenuItem>
                </Menu>

                {/* --- Confirmation Dialog --- */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to {selectedAdmin?.status === 'Active' ? 'deactivate' : 'activate'} the admin "{selectedAdmin?.name}"?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleConfirmDeactivate} color="error" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Box>
    );
};

export default ManageAdminsPage;
