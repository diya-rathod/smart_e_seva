import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'; 
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; 
import L from 'leaflet'; 

// Default marker icon ka issue fix karne ke liye
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


// Helper component jo map events aur marker position ko handle karta hai
const LocationMarker = ({ onLocationSelect, initialCoords, isMovable }) => {
    
    // Position state ko track karein
    const [position, setPosition] = useState(initialCoords);

    // Initial load par props se position set karein
    // NOTE: Yeh useEffect sirf ek baar chalna chahiye jab component mount ho
    useEffect(() => {
        if (initialCoords[0] && initialCoords[1]) {
            setPosition(initialCoords);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // <-- Dependency array empty rakhein

    
    // Marker drag end event handler - Drag karne ke baad position ko update karta hai
    const eventHandlers = useMemo(
        () => ({
            dragend(e) {
                const newPos = e.target.getLatLng();
                // 1. Position state ko naye coordinates se update karein (FIX 1)
                setPosition([newPos.lat, newPos.lng]); 
                
                // 2. Parent component (RegisterAgentPage) ko naye coordinates bhej dein
                onLocationSelect(newPos.lat, newPos.lng);
            },
        }),
        [onLocationSelect],
    );

    // Map click event listener setup karein
    // Click handler sirf tabhi chahiye jab marker drag na ho raha ho
    useMapEvents({
        click(e) {
            // Agar marker movable hai, toh click ko ignore karo, kyunki hum drag use kar rahe hain
            if (!isMovable) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                onLocationSelect(e.latlng.lat, e.latlng.lng);
            }
        },
    });


    return position ? (
        <Marker 
            position={position} 
            draggable={isMovable} 
            eventHandlers={isMovable ? eventHandlers : null}
        />
    ) : null;
};


const MapWidget = ({ onLocationSelect, initialCenter, isMarkerMovable = true }) => {
    
    const center = useMemo(() => initialCenter || [23.0225, 72.5714], [initialCenter]); 

    // onLocationSelect prop ko stable banate hain
    const stableOnLocationSelect = useCallback(onLocationSelect, [onLocationSelect]);

    // FIX: useRef use karte hain taaki initial call sirf ek baar ho (Overwrite issue fix)
    const isMountedRef = useRef(false);

    useEffect(() => {
        // Sirf pehli baar component mount hone par initial coordinates bhej dein
        if (!isMountedRef.current) {
            stableOnLocationSelect(center[0], center[1]);
            isMountedRef.current = true;
        }
    }, [center, stableOnLocationSelect]); 


    return (
        <MapContainer 
            center={center} 
            zoom={13} 
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }} 
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <LocationMarker 
                onLocationSelect={stableOnLocationSelect} 
                initialCoords={center} 
                isMovable={isMarkerMovable}
            />

        </MapContainer>
    );
};

export default MapWidget;
