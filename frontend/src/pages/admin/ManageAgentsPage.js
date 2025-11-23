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

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const ManageAgentsPage = () => {
    const { auth } = useContext(AuthContext);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // States for Search
    const [searchEmail, setSearchEmail] = useState('');
    const [searchEmployeeId, setSearchEmployeeId] = useState('');

    // States for Action Menu & Dialog
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    // --- 1. Fetch all agents ---
    useEffect(() => {
        const fetchAgents = async () => {
            if (!auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                // API to get all users with ROLE_AGENT
                const { data } = await axios.get(`${API_BASE_URL}/admin/users?role=ROLE_AGENT`, config);
                setAgents(data);
            } catch (error) {
                console.error("Failed to fetch agents:", error);
                toast.error("Could not load agent data.");
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, [auth.token]);

    // --- 2. Search Logic ---
    const filteredAgents = agents.filter(agent => {
        const emailMatch = agent.email.toLowerCase().includes(searchEmail.toLowerCase());
        const employeeIdMatch = agent.employeeId?.toLowerCase().includes(searchEmployeeId.toLowerCase()) ?? true;
        return emailMatch && employeeIdMatch;
    });

    // --- 3. Action Menu Handlers ---
    const handleMenuClick = (event, agent) => {
        setAnchorEl(event.currentTarget);
        setSelectedAgent(agent);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedAgent(null);
    };

    // --- 4. Deactivate Logic ---
    const handleDeactivateClick = () => {
        setDialogOpen(true);
        
    };

    const handleConfirmDeactivate = async () => {
        if (!selectedAgent) return;

        const toastId = toast.loading('Updating agent status...');
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            const newStatus = selectedAgent.status === 'Active' ? 'Inactive' : 'Active';
            await axios.put(`${API_BASE_URL}/admin/users/${selectedAgent.id}/status`, { status: newStatus }, config);

            setAgents(agents.map(a => a.id === selectedAgent.id ? { ...a, status: newStatus } : a));
            toast.success(`Agent ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully!`, { id: toastId });

        } catch (error) {
            toast.error('Failed to update status.', { id: toastId });
        } finally {
            setDialogOpen(false);
            handleMenuClose();
        }
    };


    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Manage Agents
            </Typography>

            <Card sx={{ p: 2 }}>
                {/* --- Search Filters --- */}
                <Box sx={{ mb: 2 }}>
                    <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth size="small" label="Search by Email" value={searchEmail} onChange={(e) => setSearchEmail(e.target.value)} />
                        </Grid>
                        <Grid xs={12} sm={6}>
                            <TextField fullWidth size="small" label="Search by Employee ID" value={searchEmployeeId} onChange={(e) => setSearchEmployeeId(e.target.value)} />
                        </Grid>
                    </Grid>
                </Box>

                {/* --- Agents Table --- */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Employee ID</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Division</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAgents.map((agent) => (
                                <TableRow key={agent.id} hover>
                                    <TableCell>{agent.name}</TableCell>
                                    <TableCell>{agent.email}</TableCell>
                                    <TableCell>{agent.employeeId || 'N/A'}</TableCell>
                                    <TableCell>{agent.division || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Chip label={agent.status} color={agent.status === 'Active' ? 'success' : 'error'} size="small" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuClick(e, agent)}>
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
                        if (selectedAgent) {
                            navigate(`/admin/agent/${selectedAgent.id}`); // Naye page par ID ke saath bhej do
                        }
                        handleMenuClose();
                    }}>
                        <ViewIcon sx={{ mr: 1 }} /> View/Edit Details
                    </MenuItem>
                    <MenuItem onClick={handleDeactivateClick}>
                        <DeactivateIcon sx={{ mr: 1 }} />
                        {selectedAgent?.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </MenuItem>
                </Menu>

                {/* --- Confirmation Dialog --- */}
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to {selectedAgent?.status === 'Active' ? 'deactivate' : 'activate'} the agent "{selectedAgent?.name}"?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => { setDialogOpen(false); handleMenuClose(); }}>Cancel</Button> {/* <-- YAHAN ADD KARO */}
                        <Button onClick={handleConfirmDeactivate} color="error" autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        </Box>
    );
};

export default ManageAgentsPage;