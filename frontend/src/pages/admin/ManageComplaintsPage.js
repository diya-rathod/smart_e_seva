import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import Modal from '../../components/ui/Modal';
import AssignmentLogicComponent from './AssignmentLogicComponent';
// We can create a new CSS file for this page
// import './ManageComplaintsPage.css'; 

const ManageComplaintsPage = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    const [assignmentModal, setAssignmentModal] = useState({ isOpen: false, complaint: null });

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

    const handleAssignClick = (complaint) => {
        // Sirf un complaints ko assign karne den jinko pehle assign nahi kiya gaya hai
        if (complaint.status === 'New' && !complaint.agent) {
            setAssignmentModal({ isOpen: true, complaint: complaint });
        } else {
             // Already assigned ya resolved complaint ko dobara assign nahi kar sakte
             alert(`Complaint ${complaint.status} hai ya already assigned hai.`);
        }
    };


    const handleAssignmentSuccess = (updatedComplaint) => {
        // Complaint list ko update karein (for UI sync)
        setComplaints(prev => prev.map(c => 
            c.id === updatedComplaint.id ? updatedComplaint : c
        ));
        setAssignmentModal({ isOpen: false, complaint: null });
    };
    
    const handleModalClose = () => {
        setAssignmentModal({ isOpen: false, complaint: null });
    };

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
                                    <td>
                                        <span style={{ color: complaint.status === 'New' ? 'red' : 'green', fontWeight: 'bold' }}>
                                            {complaint.status}
                                        </span>
                                    </td>
                                    <td>
                                        {/* View Link */}
                                        <Link to={`/admin/complaints/${complaint.id}`} className="btn-link">View</Link>
                                        
                                        {/* Assign Button/Link */}
                                        {complaint.status === 'New' && !complaint.agent && complaint.latitude && complaint.longitude ? (
                                            <>
                                                &nbsp;/&nbsp;
                                                <span 
                                                    onClick={() => handleAssignClick(complaint)} 
                                                    style={{ cursor: 'pointer', color: '#007bff', fontWeight: 'bold' }}
                                                >
                                                    Assign
                                                </span>
                                            </>
                                        ) : (
                                            // Agar complaint already assigned hai toh Agent ka email dikhayein
                                            complaint.agent ? ` (Assigned to: ${complaint.agent.email})` : null
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {assignmentModal.isOpen && assignmentModal.complaint && (
                <Modal 
                    isOpen={assignmentModal.isOpen} 
                    onClose={handleModalClose} 
                    title={`Assign Agent to ${assignmentModal.complaint.ticketId}`}
                >
                    <AssignmentLogicComponent 
                        complaint={assignmentModal.complaint} 
                        onAssignmentSuccess={handleAssignmentSuccess} // Success handler
                        hideConfirmButton={true}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ManageComplaintsPage;