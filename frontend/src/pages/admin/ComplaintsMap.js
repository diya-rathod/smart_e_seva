// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// // Blinking marker ke liye custom CSS icon
// // AdivIcon allows us to use pure CSS for the marker
//     const blinkingIcon = new L.divIcon({
//     className: 'blinking-marker',
//     html: '<div class="blinking-dot"></div>',
//     iconSize: [20, 20],
//     });

// const ComplaintsMap = () => {
//     const [complaints, setComplaints] = useState([]);
//     const mapCenter = [23.0225, 72.5714]; // Ahmedabad's coordinates

//     useEffect(() => {
//         // Connect to the backend SSE endpoint
//         const eventSource = new EventSource("http://localhost:8080/api/v1/notifications/subscribe");

//         // Listen for 'new_complaint' events
//         eventSource.addEventListener("new_complaint", (event) => {
//             const newComplaint = JSON.parse(event.data);
//             console.log("New complaint received on map:", newComplaint);
            
//             // Add the new complaint to our list if it has coordinates
//             if (newComplaint.latitude && newComplaint.longitude) {
//                 setComplaints(prevComplaints => [...prevComplaints, newComplaint]);
//             }
//         });

//         // Clean up the connection when the component unmounts
//         return () => {
//             eventSource.close();
//         };
//     }, []); // Empty array means this runs only once

//     return (
//         <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />

//             {/* <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//             /> */}
//             {complaints.map(complaint => (
//                 <Marker 
//                     key={complaint.id} 
//                     position={[complaint.latitude, complaint.longitude]}
//                     icon={blinkingIcon}
//                 >
//                     <Popup>
//                         <strong>{complaint.category}</strong><br/>
//                         Ticket: {complaint.ticketId}<br/>
//                         Status: {complaint.status}
//                     </Popup>
//                 </Marker>
//             ))}
//         </MapContainer>
//     );
// };

// export default ComplaintsMap;




import React, { useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import ComplaintContext from '../../context/ComplaintContext'; // Naya import

// Blinking marker ke liye custom CSS icon
const blinkingIcon = new L.divIcon({
    className: 'blinking-marker',
    html: '<div class="blinking-dot"></div>',
    iconSize: [20, 20],
});

const ComplaintsMap = () => {
    // Step 1: Global memory se complaints ki list get karein
    const { complaints } = useContext(ComplaintContext);
    const mapCenter = [23.0225, 72.5714];

    // Step 2: Sirf unhi complaints ko filter karein jo 'Resolved' nahi hain
    const activeComplaints = complaints.filter(c => c.status !== 'Resolved');

    return (
        <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* <TileLayer
             url="https:server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
             attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
             /> */}
            {/* Step 3: Sirf active complaints ko map par blink karwayein */}
            {activeComplaints.map(complaint => (
                (complaint.latitude && complaint.longitude) && (
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
                )
            ))}
        </MapContainer>
    );
};

export default ComplaintsMap;