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
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ManageCitizensPage = () => {
    const { auth } = useContext(AuthContext);
    const [citizens, setCitizens] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // States for Search
    const [searchEmail, setSearchEmail] = useState('');
    const [searchMeterNumber, setSearchMeterNumber] = useState('');

    // State for Action Menu
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedCitizen, setSelectedCitizen] = useState(null);

    // State for Confirmation Dialog
    const [dialogOpen, setDialogOpen] = useState(false);

    // --- 1. Fetch all citizens ---
    useEffect(() => {
        const fetchCitizens = async () => {
            if (!auth || !auth.token) {
                console.log("Skipping fetchCitizens: auth is null or no token"); // Ek log add 
                setLoading(false);
                return;
                // 
            } // <-- YEH HAI SAHI FIX
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                // API to get all users with ROLE_CITIZEN
                const { data } = await axios.get(`${API_BASE_URL}/admin/users?role=ROLE_CITIZEN`, config);
                setCitizens(data);
            } catch (error) {
                console.error("Failed to fetch citizens:", error);
                toast.error("Could not load citizen data.");
            } finally {
                setLoading(false);
            }
        };
        fetchCitizens();
    }, [auth]);

    // --- 2. Search Logic ---
    const filteredCitizens = citizens.filter(citizen => {
        const emailMatch = citizen.email.toLowerCase().includes(searchEmail.toLowerCase());
        const meterMatch = citizen.meterNumber?.toLowerCase().includes(searchMeterNumber.toLowerCase()) ?? true;
        return emailMatch && meterMatch;
    });

    // --- 3. Action Menu Handlers ---
    const handleMenuClick = (event, citizen) => {
        setAnchorEl(event.currentTarget);
        setSelectedCitizen(citizen);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedCitizen(null);
    };

    // --- 4. Deactivate Logic ---
    const handleDeactivateClick = () => {
       setDialogOpen(true);
    };

    const handleConfirmDeactivate = async () => {
        if (!selectedCitizen) return;

        const toastId = toast.loading('Deactivating citizen...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            // API to change user status
            const newStatus = selectedCitizen.status === 'Active' ? 'Inactive' : 'Active';
            await axios.put(`${API_BASE_URL}/admin/users/${selectedCitizen.id}/status`, { status: newStatus }, config);

            // Update UI instantly
            setCitizens(citizens.map(c => c.id === selectedCitizen.id ? { ...c, status: newStatus } : c));
            toast.success(`Citizen ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`, { id: toastId });

        } catch (error) {
            toast.error('Failed to update status.', { id: toastId });
            console.error("Failed to deactivate citizen:", error);
        } finally {
            setDialogOpen(false);
        }
    };


    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Manage Citizens
            </Typography>

            <Card sx={{ p: 2 }}>
                {/* --- Search Filters --- */}
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth size="small" label="Search by Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth size="small" label="Search by Meter Number" value={searchMeterNumber} onChange={(e) => setSearchMeterNumber(e.target.value)} />
                        </Grid>
                    </Grid>
                </Box>

                {/* --- Citizens Table --- */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Meter Number</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredCitizens.map((citizen) => (
                                <TableRow key={citizen.id} hover>
                                    <TableCell>{citizen.name}</TableCell>
                                    <TableCell>{citizen.email}</TableCell>
                                    <TableCell>{citizen.meterNumber || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip label={citizen.status} color={citizen.status === 'Active' ? 'success' : 'error'} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuClick(e, citizen)}>
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
                        // --- YEH NAYA CODE HAI ---
                        if (selectedCitizen) {
                            navigate(`/admin/citizen/${selectedCitizen.id}`); // Naye page par ID ke saath bhej do
                        }
                        handleMenuClose();
                        // --- NAYA CODE END ---
                    }}>
                        <ViewIcon sx={{ mr: 1 }} /> View/Edit Details
                    </MenuItem>
                    {/* ... Deactivate MenuItem ... */}
                    <MenuItem onClick={handleDeactivateClick}>
                        <DeactivateIcon sx={{ mr: 1 }} />
                        {selectedCitizen?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </MenuItem>
                </Menu>

                {/* --- Confirmation Dialog --- */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to {selectedCitizen?.status === 'Active' ? 'deactivate' : 'activate'} the user "{selectedCitizen?.name}"?
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

export default ManageCitizensPage;