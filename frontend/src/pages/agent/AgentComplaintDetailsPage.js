// //frontend/src/pages/agent/AgentComplaintDetailsPage.js

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';
// import toast from 'react-hot-toast';
// import Modal from '../../components/ui/Modal'; // Path corrected
// import { Button, Box, CircularProgress, Card, CardContent, Typography, Divider, IconButton } from '@mui/material'; // <-- MUI Components
// import { FiMap, FiPlayCircle, FiStopCircle} from 'react-icons/fi'; // Icon for Navigation

// const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// // --- Verification Modal Component (Nested) ---
// const VerificationModal = ({ complaintId, ticketId, onVerifySuccess, onModalClose }) => {
//     const { auth } = useContext(AuthContext);
//     const [code, setCode] = useState('');
//     const [verifying, setVerifying] = useState(false);

//     const handleVerification = async (e) => {
//         e.preventDefault();
//         if (code.length !== 6) {
//             toast.error("Please enter the 6-digit code.");
//             return;
//         }
//         setVerifying(true);

//         try {
//             const config = { headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' } };
//             // PUT API call to verify and resolve
//             const response = await axios.put(`${API_BASE_URL}/agent/verify-resolve/${complaintId}`,
//                 { code: code }, // VerificationRequestDTO use hoga
//                 config
//             );

//             toast.success(`Complaint ${ticketId} resolved and closed!`);
//             onVerifySuccess(response.data); // Update state in parent component

//         } catch (error) {
//             console.error("Verification failed:", error);
//             const errorMessage = error.response?.data || "Invalid code or verification failed.";
//             toast.error(errorMessage);
//         } finally {
//             setVerifying(false);
//         }
//     };

//     return (
//         <Modal isOpen={true} onClose={onModalClose} title={`Final Verification: ${ticketId}`} hideConfirmButton={true}>
//             <form onSubmit={handleVerification}>
//                 <p>Please get the 6-digit verification code from the citizen to resolve this complaint.</p>
//                 <input
//                     type="text"
//                     value={code}
//                     onChange={(e) => setCode(e.target.value)}
//                     maxLength="6"
//                     placeholder="Enter 6-digit Code"
//                     required
//                     disabled={verifying}
//                     style={{ padding: '10px', width: '100%', marginBottom: '15px', fontSize: '1.2em', textAlign: 'center' }}
//                 />
//                 <button type="submit" disabled={verifying} style={buttonStyle('resolved')}>
//                     {verifying ? 'Verifying...' : 'VERIFY & RESOLVE'}
//                 </button>
//             </form>
//         </Modal>
//     );
// };
// // --- End of Verification Modal Component ---


// const AgentComplaintDetailsPage = () => {
//     const { auth } = useContext(AuthContext);
//     const { id } = useParams();
//     const [complaint, setComplaint] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [statusUpdating, setStatusUpdating] = useState(false);

//     const [currentLocation, setCurrentLocation] = useState(null); // Live location state
//     const [isVerificationModalOpen, setVerificationModalOpen] = useState(false); // NEW STATE for Modal
//     const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
//     const [isTracking, setIsTracking] = useState(false); // Kya tracking chalu hai?
//     const watchIdRef = useRef(null); // watchPosition ki
//     const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };



//     // --- 1. Fetch Complaint Details (Agent API) ---
//     useEffect(() => {
//         const fetchDetails = async () => {
//             if (!auth.token || !id) { setLoading(false); return; }
//             try {
//                 const response = await axios.get(`${API_BASE_URL}/agent/complaints/${id}`, config);
//                 setComplaint(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch complaint details:", error);
//                 toast.error(`Error loading complaint ${id}.`);
//             } finally { setLoading(false); }
//         };
//         fetchDetails();
//     }, [auth.token, id]);

//     // --- 2. Live Location Fetcher ---
//     useEffect(() => {
//         if ("geolocation" in navigator) {
//             // Location fetch karne ki koshish karo
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     // Success: Location mil gayi to state mein save kar lo
//                     setCurrentLocation({
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude
//                     });
//                     toast.success("Live location fetched!");
//                 },
//                 (error) => {
//                     // Error: Agar location nahi mili
//                     console.error("Error getting live location:", error);
//                     setCurrentLocation(false); // State mein false set kar do
//                     toast.error("Could not get your location. Please check browser permission and move to an open area.");
//                 },
//                 {
//                     enableHighAccuracy: true,
//                     timeout: 15000, // Timeout badha kar 15 seconds kar diya
//                     maximumAge: 0
//                 }
//             );
//         } else {
//             // Agar browser mein location feature hi nahi hai
//             setCurrentLocation(false);
//             toast.error("Geolocation is not supported by this browser.");
//         }
//     }, []); // Yeh useEffect sirf component load hone par ek baar chalega

//     // --- 3. Navigation Handler (Combines location check & URL fix) ---
//     const handleNavigate = () => {
//         if (!complaint || !complaint.latitude || !complaint.longitude) {
//             toast.error("Complaint location is missing.");
//             return;
//         }

//         const destination = `${complaint.latitude},${complaint.longitude}`;
//         let navigationUrl;

//         // Check karo ki state mein live location hai ya nahi
//         if (currentLocation && currentLocation.lat && currentLocation.lng) {
//             const source = `${currentLocation.lat},${currentLocation.lng}`;

//             // --- YEH HAI 100% SAHI GOOGLE MAPS URL ---
//             navigationUrl = `https://www.google.com/maps/dir/?api=1&origin=${source}&destination=${destination}`;

//             window.open(navigationUrl, "_blank"); // Naye tab mein URL khol do

//         } else {
//             // Agar live location nahi mili to user ko batao
//             toast.error("Your live location is not available. Please try again after some time.");
//             // Fallback: Sirf complaint ki location map par dikha do
//             navigationUrl = `http://googleusercontent.com/maps.google.com/search/?api=1&query=${destination}`;

//         }
//         window.open(navigationUrl, "_blank");
//     };

//     // --- 4. Code Generation & Status Change Handler ---
//     const handleCodeGeneration = async (currentStatus) => {

//         setConfirmModalOpen(true);
//     };

//     const updateLocationAPI = async (latitude, longitude) => {
//         if (!auth.token) return;
//         try {
//             const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//             await axios.put(`${API_BASE_URL}/agent/location`, { latitude, longitude }, config);
//             console.log('Location updated:', latitude, longitude); // Log kar sakte hain
//         } catch (error) {
//             console.error("Failed to update location via API:", error);
//             // Yahan toast dikha sakte hain agar zaroori ho
//         }
//     };

//     // Function jo location tracking shuru karega
//     const startTracking = () => {
//         if (!("geolocation" in navigator)) {
//             toast.error("Geolocation is not supported by your browser.");
//             return;
//         }

//         setIsTracking(true);
//         toast.success("Live location tracking started!");

//         // watchPosition ko call karo aur ID save karo
//         watchIdRef.current = navigator.geolocation.watchPosition(
//             (position) => {
//                 // Har baar nayi location milne par API call karo
//                 const { latitude, longitude } = position.coords;
//                 updateLocationAPI(latitude, longitude);
//             },
//             (error) => {
//                 // Agar location fetch karne mein error aaye
//                 console.error("Error watching position:", error);
//                 toast.error(`Location tracking error: ${error.message}`);
//                 stopTracking(); // Tracking band kar do
//             },
//             {
//                 enableHighAccuracy: true, // Best possible location
//                 timeout: 10000,          // 10 second timeout
//                 maximumAge: 0,           // Hamesha nayi location chahiye
//                 distanceFilter: 10       // Location tabhi update hogi jab agent 10 meter move karega (optional)
//             }
//         );
//     };

//     // Function jo location tracking band karega
//     const stopTracking = () => {
//         if (watchIdRef.current !== null) {
//             navigator.geolocation.clearWatch(watchIdRef.current);
//             watchIdRef.current = null; // ID ko reset karo
//             setIsTracking(false);
//             toast.info("Live location tracking stopped.");
//             console.log("Tracking stopped.");
//         }
//     };

//     useEffect(() => {
//         // Yeh function tab chalega jab component screen se hatega
//         return () => {
//             stopTracking();
//         };
//     }, []);

//     // --- NAYE FUNCTIONS END ---

//     const confirmAndGenerateCode = async () => {
//         if (statusUpdating) return;
//         setStatusUpdating(true);
//         setConfirmModalOpen(false); // Naye modal ko band karo

//         try {
//             // Yeh aapka purana logic hai
//             const response = await axios.get(`${API_BASE_URL}/agent/generate-code/${complaint.id}`, config);
//             toast.success("Verification code has been sent to the citizen successfully!");
//             setVerificationModalOpen(true); // Purana code entry modal kholo

//         } catch (error) {
//             console.error("Code generation failed:", error);
//             const errorMessage = error.response?.data || "Error starting verification process.";
//             toast.error(errorMessage);
//         } finally {
//             setStatusUpdating(false);
//         }
//     };


//     // Final handler after successful verification
//     const handleVerificationSuccess = (updatedComplaint) => {
//         setComplaint(updatedComplaint); // UI update karein
//         setVerificationModalOpen(false);
//         stopTracking();
//     };

//     // --- Render Logic ---
//     if (loading) return <div>Loading Complaint Details...</div>;
//     if (!complaint) return <div>Complaint not found or unauthorized access.</div>;

//     const isResolved = complaint.status === 'Resolved';
//     const isInProgress = complaint.status === 'In-Progress';
//     // const isReadyToStart = complaint.status === 'New' || complaint.status === 'Assigned';
//     const isAssignedOrNew = complaint.status === 'Assigned' || complaint.status === 'New';

//     return (
//         <div style={{ padding: '20px' }}>
//             <h1>Complaint Details: {complaint.ticketId}</h1>
//             <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
//                 <p><strong>Category:</strong> {complaint.category}</p>
//                 <p><strong>Description:</strong> {complaint.description}</p>
//                 <p><strong>Location:</strong> {complaint.location} (Landmark: {complaint.landmark})</p>
//                 <p><strong>Citizen Email:</strong> {complaint.citizen?.email}</p>

//                 {/* Navigation Button */}
//                 <div style={{ marginTop: '15px', marginBottom: '15px' }}>
//                     <button
//                         onClick={handleNavigate}
//                         disabled={!complaint.latitude}
//                         style={{ ...buttonStyle('navigate'), backgroundColor: '#007bff', color: 'white' }}
//                     >
//                         <FiMap style={{ marginRight: '5px' }} /> Navigate from Live Location
//                     </button>
//                     {currentLocation === false && (
//                         <p style={{ color: 'red', fontSize: '0.9em' }}>Could not fetch your live location. Map will show complaint destination only.</p>
//                     )}
//                     {(complaint.status === 'Assigned' || complaint.status === 'In-Progress') && (
//                         isTracking ? (
//                             // Agar tracking chalu hai, to Stop button dikhao
//                             <Button 
//                                 variant="contained" 
//                                 color="error" 
//                                 onClick={stopTracking}
//                                 startIcon={<FiStopCircle />}
//                             >
//                                 Stop Tracking
//                             </Button>
//                         ) : (
//                             // Agar tracking band hai, to Start button dikhao
//                             <Button 
//                                 variant="contained" 
//                                 color="success" 
//                                 onClick={startTracking}
//                                 startIcon={<FiPlayCircle />}
//                             >
//                                 Start Journey
//                             </Button>
//                         )
//                     )}
//                     {/* --- NAYA BUTTON LOGIC END --- */}

//                     {/* ... error message ... */}
                    
//                 </div>

//                 <hr />
//                 <p style={{ fontWeight: 'bold', color: isResolved ? 'green' : 'red' }}>Current Status: {complaint.status}</p>

//                 {/* Status Update Buttons */}
//                 <div style={{ marginTop: '20px' }}>
//                     {/* Button A: Start Work / Get Code
//                     {isReadyToStart && (
//                         <button onClick={() => handleCodeGeneration(complaint.status)} disabled={statusUpdating} style={buttonStyle('progress')}>
//                             {statusUpdating ? 'Starting Work...' : 'START WORK & GET CODE'}
//                         </button>
//                     )} */}

//                     {/* Button B: Mark as Resolved (Verification Modal open karein) */}

//                     {(isInProgress || isAssignedOrNew) && !isResolved && (
//                         <button
//                             // FIX: handleCodeGeneration ko call karein on click
//                             onClick={() => handleCodeGeneration(complaint.status)}
//                             disabled={statusUpdating}
//                             style={buttonStyle('resolved')}
//                         >
//                             {statusUpdating ? 'Generating Code...' : 'MARK AS RESOLVED (Get Code)'}
//                         </button>
//                     )}
//                     {/* {isInProgress && (
//                         <button onClick={() => setVerificationModalOpen(true)} disabled={statusUpdating} style={buttonStyle('resolved')}>
//                             Mark as Resolved
//                         </button>
//                     )} */}
//                 </div>
//             </div>

//             {/* --- Verification Modal Render --- */}
//             {isVerificationModalOpen && complaint && (
//                 <VerificationModal
//                     complaintId={complaint.id}
//                     ticketId={complaint.ticketId}
//                     onVerifySuccess={handleVerificationSuccess}
//                     onModalClose={() => setVerificationModalOpen(false)}
//                 />
//             )}

//             {isConfirmModalOpen && (
//                 <Modal
//                     isOpen={true}
//                     onClose={() => setConfirmModalOpen(false)}
//                     title="Confirm Action"
//                     // Naye modal ke confirm par naya function call karo
//                     onConfirm={confirmAndGenerateCode}
//                     confirmText="Yes, Proceed"
//                     cancelText="No, Cancel"
//                 >
//                     <p>Are you sure you have reached the location and are ready to mark this complaint as resolved? This will generate the Citizen Verification Code.</p>
//                 </Modal>
//             )}
//         </div>
//     );
// };

// // Inline styling for buttons
// const buttonStyle = (type) => ({
//     padding: '10px 15px',
//     marginRight: '10px',
//     backgroundColor: type === 'progress' ? '#ffc107' : type === 'resolved' ? '#28a745' : '#ccc',
//     color: type === 'progress' ? '#333' : 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     display: 'flex',
//     alignItems: 'center'
// });

// export default AgentComplaintDetailsPage;






import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Modal from '../../components/ui/Modal';
import { Button } from '@mui/material'; 
import { FiMap, FiPlayCircle, FiStopCircle } from 'react-icons/fi';

// --- NEW IMPORTS FOR WEBSOCKET ---
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';
const WS_URL = 'https://smart-eseva-backend.onrender.com/ws'; // WebSocket URL

// --- Verification Modal Component (Same as before) ---
const VerificationModal = ({ complaintId, ticketId, onVerifySuccess, onModalClose }) => {
    const { auth } = useContext(AuthContext);
    const [code, setCode] = useState('');
    const [verifying, setVerifying] = useState(false);

    const handleVerification = async (e) => {
        e.preventDefault();
        if (code.length !== 6) { toast.error("Please enter the 6-digit code."); return; }
        setVerifying(true);
        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}`, 'Content-Type': 'application/json' } };
            const response = await axios.put(`${API_BASE_URL}/agent/verify-resolve/${complaintId}`, { code: code }, config);
            toast.success(`Complaint ${ticketId} resolved!`);
            onVerifySuccess(response.data);
        } catch (error) {
            toast.error(error.response?.data || "Verification failed.");
        } finally { setVerifying(false); }
    };

    return (
        <Modal isOpen={true} onClose={onModalClose} title={`Final Verification: ${ticketId}`} hideConfirmButton={true}>
            <form onSubmit={handleVerification}>
                <p>Enter 6-digit verification code from citizen.</p>
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} maxLength="6" placeholder="Enter Code" required disabled={verifying} style={{ padding: '10px', width: '100%', marginBottom: '15px', textAlign: 'center' }} />
                <button type="submit" disabled={verifying} style={{ padding: '10px', width: '100%', backgroundColor: '#28a745', color: 'white', border: 'none' }}>{verifying ? 'Verifying...' : 'VERIFY & RESOLVE'}</button>
            </form>
        </Modal>
    );
};

const AgentComplaintDetailsPage = () => {
    const { auth } = useContext(AuthContext);
    const { id } = useParams();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusUpdating, setStatusUpdating] = useState(false);
    const [currentLocation, setCurrentLocation] = useState(null);
    const [isVerificationModalOpen, setVerificationModalOpen] = useState(false);
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    
    // --- TRACKING STATES ---
    const [isTracking, setIsTracking] = useState(false);
    const watchIdRef = useRef(null);
    const stompClientRef = useRef(null); // Ref for WebSocket Client

    const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!auth.token || !id) { setLoading(false); return; }
            try {
                const response = await axios.get(`${API_BASE_URL}/agent/complaints/${id}`, config);
                setComplaint(response.data);
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetchDetails();
    }, [auth.token, id]);

    // Simple Location Fetch (One time)
    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
                (error) => console.error("Loc error", error),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    const handleNavigate = () => {
        if (!complaint?.latitude) return toast.error("Complaint location missing.");
        const dest = `${complaint.latitude},${complaint.longitude}`;
        const src = currentLocation ? `${currentLocation.lat},${currentLocation.lng}` : '';
        window.open(`https://www.google.com/maps/dir/?api=1&origin=${src}&destination=${dest}`, "_blank");
    };

    // --- MAIN TRACKING FUNCTION ---
    const startTracking = () => {
        if (!("geolocation" in navigator)) return toast.error("Geolocation not supported.");
        
        // 1. WebSocket Connect Logic
        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("Agent WS Connected for Tracking");
                setIsTracking(true);
                toast.success("Journey Started & Live Tracking Active!");
                
                // 2. Start Geolocation Watch inside WS Connect
                watchIdRef.current = navigator.geolocation.watchPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        
                        // A. Send to WebSocket (For User Map) - FAST
                        const locationData = { lat: latitude, lng: longitude };
                        client.publish({
                            destination: `/topic/complaint/${complaint.id}/location`,
                            body: JSON.stringify(locationData)
                        });

                        // B. Send to Database (Optional - for history) - SLOW
                        updateLocationAPI(latitude, longitude);
                    },
                    (error) => console.error("Watch Error", error),
                    { enableHighAccuracy: true, maximumAge: 0 }
                );
            },
            onStompError: (frame) => console.error("WS Error", frame)
        });

        client.activate();
        stompClientRef.current = client;
    };

    const stopTracking = () => {
        // 1. Stop Geolocation
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        // 2. Stop WebSocket
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }
        setIsTracking(false);
        toast.info("Journey Ended.");
    };

    // Database Update Helper
    const updateLocationAPI = async (latitude, longitude) => {
        try {
            await axios.put(`${API_BASE_URL}/agent/location`, { latitude, longitude }, config);
        } catch (error) { console.error("API Update failed", error); }
    };

    // Cleanup on Unmount
    useEffect(() => {
        return () => stopTracking();
    }, []);

    const handleCodeGeneration = () => setConfirmModalOpen(true);
    
    const confirmAndGenerateCode = async () => {
        setConfirmModalOpen(false);
        setStatusUpdating(true);
        try {
            await axios.get(`${API_BASE_URL}/agent/generate-code/${complaint.id}`, config);
            toast.success("Code sent to citizen!");
            setVerificationModalOpen(true);
        } catch (error) { toast.error("Error generating code."); } 
        finally { setStatusUpdating(false); }
    };

    const handleVerificationSuccess = (updatedComplaint) => {
        setComplaint(updatedComplaint);
        setVerificationModalOpen(false);
        stopTracking();
    };

    if (loading) return <div>Loading...</div>;
    if (!complaint) return <div>Complaint not found.</div>;

    const isResolved = complaint.status === 'Resolved';
    const isAssignedOrNew = complaint.status === 'Assigned' || complaint.status === 'New' || complaint.status === 'In-Progress';

    return (
        <div style={{ padding: '20px' }}>
            <h1>Complaint: {complaint.ticketId}</h1>
            <div style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <p><strong>Category:</strong> {complaint.category}</p>
                <p><strong>Address:</strong> {complaint.location}, {complaint.landmark}</p>
                <p><strong>Status:</strong> <span style={{color: isResolved ? 'green' : 'orange'}}>{complaint.status}</span></p>

                <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    <Button variant="contained" color="primary" onClick={handleNavigate} startIcon={<FiMap />}>
                        Navigate
                    </Button>

                    {!isResolved && (
                         isTracking ? 
                         <Button variant="contained" color="error" onClick={stopTracking} startIcon={<FiStopCircle />}>Stop Journey</Button> 
                         : 
                         <Button variant="contained" color="success" onClick={startTracking} startIcon={<FiPlayCircle />}>Start Journey</Button>
                    )}
                </div>

                <div style={{ marginTop: '20px' }}>
                    {!isResolved && isAssignedOrNew && (
                        <Button variant="contained" style={{backgroundColor: '#28a745'}} onClick={handleCodeGeneration}>
                            MARK AS RESOLVED (Get Code)
                        </Button>
                    )}
                </div>
            </div>

            {isVerificationModalOpen && (
                <VerificationModal complaintId={complaint.id} ticketId={complaint.ticketId} onVerifySuccess={handleVerificationSuccess} onModalClose={() => setVerificationModalOpen(false)} />
            )}

            {isConfirmModalOpen && (
                <Modal isOpen={true} onClose={() => setConfirmModalOpen(false)} title="Confirm Action" onConfirm={confirmAndGenerateCode} confirmText="Yes, Generate Code">
                    <p>Have you reached the location? This will send an OTP to the user.</p>
                </Modal>
            )}
        </div>
    );
};

export default AgentComplaintDetailsPage;