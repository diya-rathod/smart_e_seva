//frontend/src/components/admin/AssignmentLogicComponent.js

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AssignmentLogicComponent = ({ complaint, onAssignmentSuccess }) => {
    const { auth } = useContext(AuthContext);
    const [nearestAgent, setNearestAgent] = useState(null);
    const [loading, setLoading] = useState(false);

    // Initial load par nearest agent ko fetch karein
    useEffect(() => {
        const fetchNearestAgent = async () => {
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get(`https://smart-eseva-backend.onrender.com/api/v1/admin/nearest-agent/${complaint.id}`, config);

                setNearestAgent(response.data);
                toast.success(`Nearest Agent found: ${response.data.name}`);

            } catch (error) {
                console.error("Failed to fetch nearest agent:", error);
                if (error.response && error.response.status === 404) {
                    toast.error("No AVAILABLE agent found nearby.");
                } else {
                    toast.error("Error fetching nearest agent.");
                }
                setNearestAgent(null);
            }
            setLoading(false);
        };

        if (complaint && auth.token) {
            fetchNearestAgent();
        }
    }, [complaint, auth.token]); // Dependency array mein complaint aur token

    // Assignment Logic
    const assignAgent = async () => {
        if (!complaint || !nearestAgent || loading) return;
        setLoading(true);

        const assignmentDTO = {
            complaintId: complaint.id,
            agentId: nearestAgent.id
        };

        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' } };

            // FIX 1: API se milne waale response ko 'response' variable mein save karo
            const response = await axios.put('https://smart-eseva-backend.onrender.com/api/v1/admin/assign-agent', assignmentDTO, config);

            toast.success(`Complaint ${complaint.ticketId} assigned to ${nearestAgent.name}!`);

            // FIX 2: API se jo naya data (updated complaint) mila hai, use parent ko pass karo
            onAssignmentSuccess(response.data);

        } catch (error) {
            console.error("Assignment failed:", error.response?.data || error);
            toast.error("Assignment failed. Check agent status.");
        }
        setLoading(false);
    };

    return (
        <div>
            <p><strong>Ticket ID:</strong> {complaint.ticketId}</p>
            <p><strong>Location:</strong> {complaint.location}</p>
            <p><strong>Category:</strong> {complaint.category}</p>

            {loading && <p style={{ color: '#007bff' }}>Searching for nearest available agent...</p>}

            {/* Nearest Agent Display */}
            {!loading && nearestAgent && (
                <div style={{ border: '1px solid #28a745', padding: '10px', borderRadius: '5px', marginTop: '15px' }}>
                    <p style={{ margin: '0', fontWeight: 'bold', color: '#28a745' }}>✅ Nearest Agent Found:</p>
                    <p style={{ margin: '5px 0' }}>Name: {nearestAgent.name} ({nearestAgent.employeeId})</p>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>Division: {nearestAgent.division}</p>
                    <p style={{ margin: '0', fontSize: '0.9em' }}>Status: {nearestAgent.availabilityStatus}</p>
                    <button
                        onClick={assignAgent}
                        disabled={loading}
                        style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '6px', marginTop: '15px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {loading ? 'Assigning...' : `ASSIGN TO ${nearestAgent.name.toUpperCase()}`}
                    </button>
                </div>
            )}

            {/* No Agent Found State */}
            {!loading && !nearestAgent && (
                <p style={{ color: '#dc3545', fontWeight: 'bold', marginTop: '15px' }}>
                    ❌ No AVAILABLE Agent found nearby.
                </p>
            )}
        </div>
    );
};

export default AssignmentLogicComponent;