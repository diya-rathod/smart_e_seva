import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import toast from 'react-hot-toast';
import './ComplaintDetails.css'; // Aapki purani CSS file
import { FiCheckCircle } from 'react-icons/fi';

// --- MAP & WEBSOCKET IMPORTS ---
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // <-- Naya import
// --- END IMPORTS ---

// Leaflet icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API_BASE_URL = 'http://localhost:8080/api/v1';

const ComplaintDetails = () => {
    const { ticketId } = useParams();
    const { auth } = useContext(AuthContext);
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- NAYE STATES LIVE TRACKING KE LIYE ---
    const [agentPosition, setAgentPosition] = useState(null);
    const stompClientRef = useRef(null);

    // --- 1. Fetch Complaint Details from API ---
    useEffect(() => {
        const fetchDetails = async () => {
            if (!auth || !auth.token || !ticketId) return;
            setLoading(true);
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get(`${API_BASE_URL}/users/complaint/${ticketId}`, config);
                setComplaint(response.data);
            } catch (error) {
                toast.error("Could not load complaint details.");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [ticketId, auth]);

    // --- 2. WebSocket Connection Logic ---
    // useEffect(() => {
    //     if (complaint && complaint.agent && complaint.status !== 'Resolved') {
    //         const socket = new SockJS('http://localhost:8080/ws');
    //         const stompClient = Stomp.over(socket);
    //         stompClientRef.current = stompClient;

    //         stompClient.connect({}, () => {
    //             const topic = `/topic/complaint/${complaint.id}/location`;
    //             stompClient.subscribe(topic, (message) => {
    //                 const locationUpdate = JSON.parse(message.body);
    //                 setAgentPosition([locationUpdate.lat, locationUpdate.lng]);
    //             });
    //         }, () => {
    //             toast.error("Live tracking connection failed.");
    //         });

    //         return () => {
    //             if (stompClientRef.current && stompClientRef.current.connected) {
    //                 stompClientRef.current.disconnect();
    //             }
    //         };
    //     }
    // }, [complaint]);
    useEffect(() => {
        if (complaint && complaint.agent && complaint.status !== 'Resolved') {
            
            // 1. Naya STOMP client banao
            const client = new Client({
                // Broker URL ki zaroorat nahi jab SockJS use kar rahe hain
                webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
                debug: function (str) {
                    console.log('STOMP DEBUG: ' + str); // Detailed logging
                },
                reconnectDelay: 5000, // 5 second mein reconnect karo
            });

            // 2. Connection successful hone par kya karna hai
            client.onConnect = (frame) => {
                console.log('WebSocket Connected: ' + frame);
                const topic = `/topic/complaint/${complaint.id}/location`;
                console.log('Subscribing to:', topic);

                // Sahi topic ko subscribe karo
                client.subscribe(topic, (message) => {
                    try {
                        const locationUpdate = JSON.parse(message.body);
                        console.log('Agent location received:', locationUpdate);
                        setAgentPosition([locationUpdate.lat, locationUpdate.lng]); 
                    } catch (e) {
                        console.error("Error parsing location update:", e);
                    }
                });
            };

            // 3. Error hone par kya karna hai
            client.onStompError = (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                toast.error("Live tracking connection failed.");
            };

            // 4. Connection ko activate karo
            client.activate();

            // Ref mein client ko save kar lo taaki hum use disconnect kar sakein
            stompClientRef.current = client;

            // Cleanup function: Component hatne par connection band karo
            return () => {
                if (stompClientRef.current) {
                    console.log("Deactivating WebSocket connection...");
                    stompClientRef.current.deactivate();
                }
            };
        }
    }, [complaint]); // Yeh effect tab chalega jab complaint state change hogi

    if (loading) {
        return <h2>Loading complaint details...</h2>;
    }

    if (!complaint) {
        return <h2>Complaint not found! Please check the Ticket ID.</h2>;
    }
    
    const mapCenter = complaint.latitude && complaint.longitude 
                      ? [complaint.latitude, complaint.longitude] 
                      : [23.0225, 72.5714];

    return (
        <div className="page-content-card">
            <h1>Complaint Details: {complaint.ticketId}</h1>
            <div className="details-grid">
                <div className="details-main">
                    
                    {/* --- NAYA MAP SECTION --- */}
                    <div className="details-section">
                        <h2>Live Tracking</h2>
                        <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
                             <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                {complaint.latitude && complaint.longitude && (
                                    <Marker position={[complaint.latitude, complaint.longitude]}>
                                        <Popup>Your Complaint Location</Popup>
                                    </Marker>
                                )}
                                {agentPosition && (
                                    <Marker position={agentPosition}>
                                        <Popup>Agent: {complaint.agent?.name}</Popup>
                                    </Marker>
                                )}
                            </MapContainer>
                        </div>
                        {complaint.agent && complaint.status !== 'Resolved' && !agentPosition && (
                            <p>Waiting for agent to start the journey...</p>
                        )}
                    </div>
                    {/* --- MAP SECTION END --- */}

                    <div className="details-section">
                        <h2>Description</h2>
                        <p>{complaint.description}</p>
                    </div>

                    {complaint.photoUrl && (
                        <div className="details-section">
                            <h2>Photo Evidence</h2>
                            <img src={complaint.photoUrl} alt="Complaint Evidence" />
                        </div>
                    )}
                </div>

                <div className="details-sidebar">
                    {/* Isko dynamic data se connect karna padega */}
                    {/* <div className="details-section status-timeline"> ... </div> */}
                    
                    {complaint.agent && (
                        <div className="details-section agent-details">
                            <h2>Assigned Agent</h2>
                            <p><strong>Name:</strong> {complaint.agent.name}</p>
                            <p><strong>Contact:</strong> {complaint.agent.mobileNumber || 'N/A'}</p>
                        </div>
                    )}
                    
                    {/* Isko bhi dynamic data se connect karna padega */}
                    {/* <div className="details-section updates-log"> ... </div> */}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetails;