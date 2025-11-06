import React, { useState, useEffect, useContext } from 'react';
import {
    Box, Typography, Card, TableContainer, Table, TableHead,
    TableRow, TableCell, TableBody, Chip, Button, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const NewComplaintsPage = () => {
    const { auth } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // --- 1. Fetch all complaints and then filter ---
    useEffect(() => {
        const fetchComplaints = async () => {
            if (!auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/all-complaints`, config);

                // --- YEH HAI MAIN LOGIC ---
                // Sirf 'New' aur 'In-Progress' waali complaints ko filter karo
                const activeComplaints = data.filter(
                    c => c.status === 'New' || c.status === 'In-Progress'
                );
                
                setComplaints(activeComplaints);

            } catch (error) {
                console.error("Failed to fetch complaints:", error);
                toast.error("Could not load complaints data.");
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [auth.token]);

    // Status ke hisaab se color dene ke liye function
    const getStatusChipColor = (status) => {
        if (status === 'New') return 'error'; // Red color
        if (status === 'In-Progress') return 'warning'; // Yellow/Orange color
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
                New & In-Progress Complaints
            </Typography>

            <Card sx={{ p: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
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
                            {complaints.length > 0 ? (
                                complaints.map((complaint) => (
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
                                        No new or in-progress complaints found. Great job!
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

export default NewComplaintsPage;