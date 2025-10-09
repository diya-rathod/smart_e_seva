import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
    const [complaints, setComplaints] = useState([]);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // --- THIS IS THE FIX ---
        // Run this effect ONLY if the user is logged in AND their role is an admin type.
        if (!auth || !auth.token || (auth.role !== 'ROLE_ADMIN' && auth.role !== 'ROLE_SUPER_ADMIN')) {
            return; // Do nothing if not an admin
        }

        console.log("Admin user detected, initializing notifications...");

        // 1. Pehle saari existing complaints ko fetch karein
        const fetchInitialComplaints = async () => {
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get('http://localhost:8080/api/v1/admin/all-complaints', config);
                setComplaints(response.data);
            } catch (error) {
                console.error("Failed to fetch initial complaints:", error);
            }
        };

        fetchInitialComplaints();

        // 2. Fir, live notifications ke liye connect karein
        const eventSource = new EventSource("http://localhost:8080/api/v1/notifications/subscribe");
        
        eventSource.onopen = () => {
            console.log("SSE Connection established for Admin.");
        };

        eventSource.addEventListener("new_complaint", (event) => {
            const newComplaint = JSON.parse(event.data);
            setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
            toast.success(`New Complaint Received: ${newComplaint.ticketId}`);
        });

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            eventSource.close();
        };

        // Clean up the connection on logout or component unmount
        return () => {
            console.log("Closing SSE Connection for Admin.");
            eventSource.close();
        };
    }, [auth]); // Yeh effect tab chalega jab auth state change hogi

    return (
        <ComplaintContext.Provider value={{ complaints }}>
            {children}
        </ComplaintContext.Provider>
    );
};

export default ComplaintContext;