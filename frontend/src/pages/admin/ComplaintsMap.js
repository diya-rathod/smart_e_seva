import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Blinking marker ke liye custom CSS icon
const blinkingIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41],
    className: 'blinking' // CSS class for animation
});

const ComplaintsMap = () => {
    const [complaints, setComplaints] = useState([]);
    const mapCenter = [23.0225, 72.5714]; // Ahmedabad's coordinates

    useEffect(() => {
        // Connect to the backend SSE endpoint
        const eventSource = new EventSource("http://localhost:8080/api/v1/notifications/subscribe");

        // Listen for 'new_complaint' events
        eventSource.addEventListener("new_complaint", (event) => {
            const newComplaint = JSON.parse(event.data);
            console.log("New complaint received on map:", newComplaint);
            
            // Add the new complaint to our list if it has coordinates
            if (newComplaint.latitude && newComplaint.longitude) {
                setComplaints(prevComplaints => [...prevComplaints, newComplaint]);
            }
        });

        // Clean up the connection when the component unmounts
        return () => {
            eventSource.close();
        };
    }, []); // Empty array means this runs only once

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {complaints.map(complaint => (
                <Marker 
                    key={complaint.id} 
                    position={[complaint.latitude, complaint.longitude]}
                    icon={blinkingIcon}
                >
                    <Popup>
                        <strong>{complaint.category}</strong><br/>
                        Ticket: {complaint.ticketId}<br/>
                        Status: {complaint.status}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ComplaintsMap;