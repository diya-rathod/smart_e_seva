import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// We can create a new CSS file for this page
// import './ManageComplaintsPage.css'; 

const ManageComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        const fetchComplaints = async () => {
            if (!auth || !auth.token) {
                setLoading(false);
                return;
            }
            try {
                const config = {
                    headers: { 'Authorization': `Bearer ${auth.token}` }
                };
                const response = await axios.get('http://localhost:8080/api/v1/admin/all-complaints', config);
                setComplaints(response.data);
            } catch (error) {
                console.error("Failed to fetch complaints:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [auth]); // Re-run if auth state changes

    if (loading) {
        return <p>Loading complaints...</p>;
    }

    return (
        <div>
            <h1>Manage All Complaints</h1>
            <div className="page-content-card">
                {complaints.length === 0 ? (
                    <p>No complaints found in the system.</p>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid #dee2e6' }}>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Ticket ID</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Category</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                                <th style={{ padding: '12px', textAlign: 'left' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                                {complaints.map(complaint => (
                                <tr key={complaint.id}>
                                    <td>{complaint.ticketId}</td>
                                    <td>{complaint.category}</td>
                                    <td>{complaint.status}</td>
                                    <td>
                                        {/* --- THIS BUTTON IS NOW A DYNAMIC LINK --- */}
                                        <Link to={`/admin/complaints/${complaint.id}`} className="btn btn-secondary">
                                            View / Assign
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageComplaintsPage;