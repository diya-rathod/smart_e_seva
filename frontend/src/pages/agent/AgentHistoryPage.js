import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Box, Typography, Card, CardContent, Chip, Grid, Container, Paper, Divider } from '@mui/material';
import { History, EventNote, LocationOn } from '@mui/icons-material';

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const AgentHistoryPage = () => {
    const { auth } = useContext(AuthContext);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/agent/history`, {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                });
                setHistory(res.data);
            } catch (error) {
                console.error("Error fetching history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [auth.token]);

    if (loading) return <p style={{textAlign:'center', marginTop:'20px'}}>Loading History...</p>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
            {/* Header */}
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderLeft: '5px solid #0056b3', display: 'flex', alignItems: 'center', gap: 2 }}>
                <History sx={{ fontSize: 40, color: '#0056b3' }} />
                <Box>
                    <Typography variant="h5" fontWeight="bold">Job History</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total Resolved Jobs: <strong>{history.length}</strong>
                    </Typography>
                </Box>
            </Paper>

            {history.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', color: 'gray' }}>
                    <Typography>No completed jobs found yet.</Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {history.map((job) => (
                        <Grid item xs={12} key={job.id}>
                            <Card sx={{ borderRadius: '10px', boxShadow: 1 }}>
                                <CardContent>
                                    <Grid container justifyContent="space-between" alignItems="flex-start">
                                        <Grid item xs={8}>
                                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#333' }}>
                                                {job.category}
                                            </Typography>
                                            <Typography variant="caption" sx={{ display: 'block', color: 'gray', mb: 1 }}>
                                                Ticket: {job.ticketId}
                                            </Typography>
                                            
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#555' }}>
                                                <LocationOn sx={{ fontSize: 16 }} />
                                                <Typography variant="body2" noWrap>
                                                    {job.location ? job.location.substring(0, 40) : 'N/A'}...
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        
                                        <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                            <Chip label="Resolved" size="small" sx={{ bgcolor: '#e6fffa', color: '#00796b', fontWeight: 'bold', mb: 1 }} />
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5, color: 'gray' }}>
                                                <EventNote sx={{ fontSize: 14 }} />
                                                <Typography variant="caption">
                                                    {new Date(job.dateRaised).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default AgentHistoryPage;