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
//         const eventSource = new EventSource("https://smart-eseva-backend.onrender.com/api/v1/notifications/subscribe");

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




// import React, { useContext } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import ComplaintContext from '../../context/ComplaintContext'; // Naya import

// // Blinking marker ke liye custom CSS icon
// const blinkingIcon = new L.divIcon({
//     className: 'blinking-marker',
//     html: '<div class="blinking-dot"></div>',
//     iconSize: [20, 20],
// });

// const ComplaintsMap = () => {
//     // Step 1: Global memory se complaints ki list get karein
//     const { complaints = [] } = useContext(ComplaintContext);
//     const mapCenter = [23.0225, 72.5714];

//     // Step 2: Sirf unhi complaints ko filter karein jo 'Resolved' nahi hain
//     const activeComplaints = complaints.filter(c => c.status !== 'Resolved');

//     return (
//         <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
//             <TileLayer
//                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />

//             {/* <TileLayer
//              url="https:server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
//              /> */}
//             {/* Step 3: Sirf active complaints ko map par blink karwayein */}
//             {activeComplaints.map(complaint => (
//                 (complaint.latitude && complaint.longitude) && (
//                     <Marker 
//                         key={complaint.id} 
//                         position={[complaint.latitude, complaint.longitude]}
//                         icon={blinkingIcon}
//                     >
//                         <Popup>
//                             <strong>{complaint.category}</strong><br/>
//                             Ticket: {complaint.ticketId}<br/>
//                             Status: {complaint.status}
//                         </Popup>
//                     </Marker>
//                 )
//             ))}
//         </MapContainer>
//     );
// };

// export default ComplaintsMap;







// import React from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// // ComplaintContext ki ab yahan zaroorat nahi hai

// // Blinking marker ke liye custom CSS icon
// const blinkingIcon = new L.divIcon({
//     className: 'blinking-marker',
//     html: '<div class="blinking-dot"></div>',
//     iconSize: [20, 20],
// });

// // Component ab 'props' se 'complaints' lega
// const ComplaintsMap = ({ complaints = [] }) => {
//     // useContext waali line hata di gayi hai
//     const mapCenter = [23.0225, 72.5714]; // Ahmedabad

//     // Sirf 'New' aur 'In-Progress' complaints ko filter karo
//     const activeComplaints = complaints.filter(
//         c => c.status === 'New' || c.status === 'In-Progress'
//     );

//     return (
//         <MapContainer center={mapCenter} zoom={13} style={{ height: '500px', width: '100%' }}>
//             <TileLayer
//                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//             />
            
//             {activeComplaints.map(complaint => (
//                 // Check karo ki latitude aur longitude hain ya nahi
//                 (complaint.latitude && complaint.longitude) && (
//                     <Marker 
//                         key={complaint.id} 
//                         position={[complaint.latitude, complaint.longitude]}
//                         icon={blinkingIcon}
//                     >
//                         <Popup>
//                             <strong>{complaint.category}</strong><br/>
//                             Ticket: {complaint.ticketId}<br/>
//                             Status: {complaint.status}
//                         </Popup>
//                     </Marker>
//                 )
//             ))}
//         </MapContainer>
//     );
// };

// export default ComplaintsMap;



import React, { useEffect, useState, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import AuthContext from '../../context/AuthContext'; 

const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// --- BLINKING CSS ICON ---
// const blinkingIcon = new L.divIcon({
//     className: 'blinking-marker',
//     html: '<div class="blinking-dot"></div>',
//     iconSize: [20, 20],
// });


// const blinkingIcon = new L.divIcon({
//     className: 'custom-blinking-marker', // Class name change kiya taaki conflict na ho
//     // Niche HTML mein humne Image tag daal diya hai
//     html: `<div class="icon-wrapper">
//              <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Alert" class="alert-img" />
//              <div class="ripple"></div>
//            </div>`,
//     iconSize: [40, 40],   // Icon thoda bada kiya
//     iconAnchor: [20, 20], // Icon ko center mein rakhne ke liye
// });

const blinkingIcon = new L.divIcon({
    className: 'custom-map-pin', // Class name
    html: `
        <div class="pin-container">
            <div class="pin-pulse"></div>
            <div class="pin-body">
                <svg viewBox="0 0 24 24" fill="white" width="14px" height="14px">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
            </div>
        </div>
    `,
    iconSize: [30, 42],   // Size fix kiya (Width, Height)
    iconAnchor: [15, 42], // Pin ki nok (tip) exactly location par hogi
    popupAnchor: [0, -40] // Popup thoda upar khulega
});

const ComplaintsMap = () => {
    const { auth } = useContext(AuthContext);
    const [allComplaints, setAllComplaints] = useState([]);
    
    // Default Center (Ahmedabad)
    const mapCenter = [23.0225, 72.5714]; 

    // 1. INITIAL DATA FETCH (Jo missing tha)
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!auth || !auth.token) return;
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                // Khud data le aao
                const response = await axios.get(`${API_BASE_URL}/admin/all-complaints`, config);
                console.log("Loaded Map Data:", response.data.length);
                setAllComplaints(response.data);
            } catch (error) {
                console.error("Error fetching initial map data:", error);
            }
        };

        fetchInitialData();
    }, [auth]);

    // 2. LIVE UPDATES (SSE)
    useEffect(() => {
        if (!auth || !auth.token) return;

        const sseUrl = `https://smart-eseva-backend.onrender.com/api/v1/notifications/subscribe?token=${auth.token}`;
        const eventSource = new EventSource(sseUrl);

        eventSource.onopen = () => console.log("Map Live Connection: Active 🟢");

        eventSource.addEventListener("new_complaint", (event) => {
            try {
                const newData = JSON.parse(event.data);
                console.log("🔥 New Live Complaint:", newData);
                
                // Naya data list mein add karo
                setAllComplaints(prev => {
                    if (prev.find(c => c.id === newData.id)) return prev;
                    return [...prev, newData];
                });
            } catch (err) {
                console.error("Parse Error:", err);
            }
        });

        eventSource.onerror = () => eventSource.close();

        return () => eventSource.close();
    }, [auth]);

    // 3. Filter Active Complaints
    const activeComplaints = allComplaints.filter(
        c => c.status === 'New' || c.status === 'In-Progress'
    );

    return (
        <div style={{ padding: '20px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '15px', color: '#333', fontWeight: 'bold' }}>Live Complaints Map</h2>
            
            <MapContainer center={mapCenter} zoom={12} style={{ height: '500px', width: '100%', borderRadius: '12px' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                
                {activeComplaints.map(complaint => (
                    (complaint.latitude && complaint.longitude) && (
                        <Marker 
                            key={complaint.id} 
                            position={[complaint.latitude, complaint.longitude]}
                            icon={blinkingIcon} // Ye raha blinking icon
                        >
                            <Popup>
                                <div style={{ textAlign: 'center' }}>
                                    <strong style={{ color: '#d32f2f' }}>{complaint.category}</strong><br/>
                                    <span style={{ fontSize: '12px' }}>Ticket: {complaint.ticketId}</span><br/>
                                    <span style={{ fontWeight: 'bold', color: complaint.status === 'New' ? 'red' : 'orange' }}>
                                        {complaint.status}
                                    </span>
                                </div>
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
};

export default ComplaintsMap;