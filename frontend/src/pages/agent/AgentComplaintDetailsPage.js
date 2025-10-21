//frontend/src/pages/agent/AgentComplaintDetailsPage.js

import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal'; // Path corrected
import { FiMap } from 'react-icons/fi'; // Icon for Navigation

const API_BASE_URL = 'http://localhost:8080/api/v1';

// --- Verification Modal Component (Nested) ---
const VerificationModal = ({ complaintId, ticketId, onVerifySuccess, onModalClose }) => {
    const { auth } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleVerification = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error("Please enter the 6-digit code.");
            return;
        }
        setVerifying(true);

        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' } };
            // PUT API call to verify and resolve
            const response = await axios.put(`${API_BASE_URL}/agent/verify-resolve/${complaintId}`,
                { code: code }, // VerificationRequestDTO use hoga
                config
            );

            toast.success(`Complaint ${ticketId} resolved and closed!`);
            onVerifySuccess(response.data); // Update state in parent component

        } catch (error) {
            console.error("Verification failed:", error);
            const errorMessage = error.response?.data || "Invalid code or verification failed.";
            toast.error(errorMessage);
        } finally {
            setVerifying(false);
        }
    };

    return (
        <Modal isOpen={true} onClose={onModalClose} title={`Final Verification: ${ticketId}`} hideConfirmButton={true}>
            <form onSubmit={handleVerification}>
                <p>Please get the 6-digit verification code from the citizen to resolve this complaint.</p>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength="6"
                    placeholder="Enter 6-digit Code"
                    required
                    disabled={verifying}
                    style={{ padding: '10px', width: '100%', marginBottom: '15px', fontSize: '1.2em', textAlign: 'center' }}
                />
                <button type="submit" disabled={verifying} style={buttonStyle('resolved')}>
                    {verifying ? 'Verifying...' : 'VERIFY & RESOLVE'}
                </button>
            </form>
        </Modal>
    );
};
// --- End of Verification Modal Component ---


const AgentComplaintDetailsPage = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const [currentLocation, setCurrentLocation] = useState(null); // Live location state
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false); // NEW STATE for Modal
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);

    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };



    // --- 1. Fetch Complaint Details (Agent API) ---
    useEffect(() => {
        const fetchDetails = async () => {
            if (!auth.token || !id) { setLoading(false); return; }
            try {
                const response = await axios.get(`${API_BASE_URL}/agent/complaints/${id}`, config);
                setComplaint(response.data);
            } catch (error) {
                console.error("Failed to fetch complaint details:", error);
                toast.error(`Error loading complaint ${id}.`);
            } finally { setLoading(false); }
        };
        fetchDetails();
    }, [auth.token, id]);

    // --- 2. Live Location Fetcher ---
    useEffect(() => {
        if ("geolocation" in navigator) {
            // Location fetch karne ki koshish karo
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Success: Location mil gayi to state mein save kar lo
                    setCurrentLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                    toast.success("Live location fetched!");
                },
                (error) => {
                    // Error: Agar location nahi mili
                    console.error("Error getting live location:", error);
                    setCurrentLocation(false); // State mein false set kar do
                    toast.error("Could not get your location. Please check browser permission and move to an open area.");
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000, // Timeout badha kar 15 seconds kar diya
                    maximumAge: 0
                }
            );
        } else {
            // Agar browser mein location feature hi nahi hai
            setCurrentLocation(false);
            toast.error("Geolocation is not supported by this browser.");
        }
    }, []); // Yeh useEffect sirf component load hone par ek baar chalega

    // --- 3. Navigation Handler (Combines location check & URL fix) ---
    const handleNavigate = () => {
        if (!complaint || !complaint.latitude || !complaint.longitude) {
            toast.error("Complaint location is missing.");
            return;
        }

        const destination = `${complaint.latitude},${complaint.longitude}`;
        let navigationUrl;

        // Check karo ki state mein live location hai ya nahi
        if (currentLocation && currentLocation.lat && currentLocation.lng) {
            const source = `${currentLocation.lat},${currentLocation.lng}`;

            // --- YEH HAI 100% SAHI GOOGLE MAPS URL ---
            navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${destination}`;

            window.open(navigationUrl, "_blank"); // Naye tab mein URL khol do

        } else {
            // Agar live location nahi mili to user ko batao
            toast.error("Your live location is not available. Please try again after some time.");
            // Fallback: Sirf complaint ki location map par dikha do
            navigationUrl = `http://googleusercontent.com/maps.google.com/search/?api=1&query=${destination}`;

        }
        window.open(navigationUrl, "_blank");
    };

    // --- 4. Code Generation & Status Change Handler ---
    const handleCodeGeneration = async (currentStatus) => {

        setConfirmModalOpen(true);
    };

    const confirmAndGenerateCode = async () => {
        if (statusUpdating) return;
        setStatusUpdating(true);
        setConfirmModalOpen(false); // Naye modal ko band karo

        try {
            // Yeh aapka purana logic hai
            const response = await axios.get(`${API_BASE_URL}/agent/generate-code/${complaint.id}`, config);
            toast.success("Verification code has been sent to the citizen successfully!");
            setVerificationModalOpen(true); // Purana code entry modal kholo

        } catch (error) {
            console.error("Code generation failed:", error);
            const errorMessage = error.response?.data || "Error starting verification process.";
            toast.error(errorMessage);
        } finally {
            setStatusUpdating(false);
        }
    };


    // Final handler after successful verification
    const handleVerificationSuccess = (updatedComplaint) => {
        setComplaint(updatedComplaint); // UI update karein
        setVerificationModalOpen(false);
    };

    // --- Render Logic ---
    if (loading) return <div>Loading Complaint Details...</div>;
    if (!complaint) return <div>Complaint not found or unauthorized access.</div>;

    const isResolved = complaint.status === 'Resolved';
    const isInProgress = complaint.status === 'In-Progress';
    // const isReadyToStart = complaint.status === 'New' || complaint.status === 'Assigned';
    const isAssignedOrNew = complaint.status === 'Assigned' || complaint.status === 'New';

    return (
        <div style={{ padding: '20px' }}>
            <h1>Complaint Details: {complaint.ticketId}</h1>
            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p><strong>Category:</strong> {complaint.category}</p>
                <p><strong>Description:</strong> {complaint.description}</p>
                <p><strong>Location:</strong> {complaint.location} (Landmark: {complaint.landmark})</p>
                <p><strong>Citizen Email:</strong> {complaint.citizen?.email}</p>

                {/* Navigation Button */}
                <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                    <button
                        onClick={handleNavigate}
                        disabled={!complaint.latitude}
                        style={{ ...buttonStyle('navigate'), backgroundColor: '#007bff', color: 'white' }}
                    >
                        <FiMap style={{ marginRight: '5px' }} /> Navigate from Live Location
                    </button>
                    {currentLocation === false && (
                        <p style={{ color: 'red', fontSize: '0.9em' }}>Could not fetch your live location. Map will show complaint destination only.</p>
                    )}
                </div>

                <hr />
                <p style={{ fontWeight: 'bold', color: isResolved ? 'green' : 'red' }}>Current Status: {complaint.status}</p>

                {/* Status Update Buttons */}
                <div style={{ marginTop: '20px' }}>
                    {/* Button A: Start Work / Get Code
                    {isReadyToStart && (
                        <button onClick={() => handleCodeGeneration(complaint.status)} disabled={statusUpdating} style={buttonStyle('progress')}>
                            {statusUpdating ? 'Starting Work...' : 'START WORK & GET CODE'}
                        </button>
                    )} */}

                    {/* Button B: Mark as Resolved (Verification Modal open karein) */}

                    {(isInProgress || isAssignedOrNew) && !isResolved && (
                        <button
                            // FIX: handleCodeGeneration ko call karein on click
                            onClick={() => handleCodeGeneration(complaint.status)}
                            disabled={statusUpdating}
                            style={buttonStyle('resolved')}
                        >
                            {statusUpdating ? 'Generating Code...' : 'MARK AS RESOLVED (Get Code)'}
                        </button>
                    )}
                    {/* {isInProgress && (
                        <button onClick={() => setVerificationModalOpen(true)} disabled={statusUpdating} style={buttonStyle('resolved')}>
                            Mark as Resolved
                        </button>
                    )} */}
                </div>
            </div>

            {/* --- Verification Modal Render --- */}
            {isVerificationModalOpen && complaint && (
                <VerificationModal
                    complaintId={complaint.id}
                    ticketId={complaint.ticketId}
                    onVerifySuccess={handleVerificationSuccess}
                    onModalClose={() => setVerificationModalOpen(false)}
                />
            )}

            {isConfirmModalOpen && (
                <Modal
                    isOpen={true}
                    onClose={() => setConfirmModalOpen(false)}
                    title="Confirm Action"
                    // Naye modal ke confirm par naya function call karo
                    onConfirm={confirmAndGenerateCode}
                    confirmText="Yes, Proceed"
                    cancelText="No, Cancel"
                >
                    <p>Are you sure you have reached the location and are ready to mark this complaint as resolved? This will generate the Citizen Verification Code.</p>
                </Modal>
            )}
        </div>
    );
};

// Inline styling for buttons
const buttonStyle = (type) => ({
    padding: '10px 15px',
    marginRight: '10px',
    backgroundColor: type === 'progress' ? '#ffc107' : type === 'resolved' ? '#28a745' : '#ccc',
    color: type === 'progress' ? '#333' : 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center'
});

export default AgentComplaintDetailsPage;