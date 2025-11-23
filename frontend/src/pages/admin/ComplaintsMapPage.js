import React, { useState, useEffect, useContext } from 'react';
import { Box, Typography, Card, CircularProgress } from '@mui/material';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import ComplaintsMap from './ComplaintsMap'; // Wahi purana map component

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

const ComplaintsMapPage = () => {
    const { auth } = useContext(AuthContext);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!auth || !auth.token) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const { data } = await axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
                setComplaints(data);
            } catch (error) {
                console.error("Failed to fetch complaints for map page:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchComplaints();
    }, [auth]);

    return (
        <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Live Complaints Map
            </Typography>
            <Card>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <ComplaintsMap complaints={complaints} />
                )}
            </Card>
        </Box>
    );
};

export default ComplaintsMapPage;