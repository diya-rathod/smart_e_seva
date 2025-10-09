import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';

const AdminComplaintDetailsPage = () => {
    const { id } = useParams(); // URL se complaint ki ID get karein
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchComplaintDetails = async () => {
            if (!auth || !auth.token) return;

            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get(`http://localhost:8080/api/v1/admin/complaints/${id}`, config);
                setComplaint(response.data);
            } catch (error) {
                console.error("Failed to fetch complaint details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaintDetails();
    }, [id, auth]);

    if (loading) {
        return <p>Loading complaint details...</p>;
    }

    if (!complaint) {
        return <p>Complaint not found.</p>;
    }

    return (
        <div>
            <h1>Complaint Details: {complaint.ticketId}</h1>
            <div className="page-content-card">
                {/* We will design this page in more detail later */}
                <p><strong>Category:</strong> {complaint.category}</p>
                <p><strong>Status:</strong> {complaint.status}</p>
                <p><strong>Description:</strong> {complaint.description}</p>
                <p><strong>Location:</strong> {complaint.location}</p>
                <hr />
                <h4>Citizen Details</h4>
                <p><strong>Name:</strong> {complaint.citizen.name}</p>
                <p><strong>Email:</strong> {complaint.citizen.email}</p>
                <p><strong>Mobile:</strong> {complaint.citizen.mobileNumber}</p>
            </div>
        </div>
    );
};

export default AdminComplaintDetailsPage;