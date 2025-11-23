// import React, { createContext, useState, useEffect, useContext } from 'react';
// import AuthContext from './AuthContext';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const ComplaintContext = createContext();

// export const ComplaintProvider = ({ children }) => {
//     const [complaints, setComplaints] = useState([]);
//     const { auth } = useContext(AuthContext);

//     useEffect(() => {
//         // --- THIS IS THE FIX ---
//         // Run this effect ONLY if the user is logged in AND their role is an admin type.
//         if (!auth || !auth.token || (auth.role !== 'ROLE_ADMIN' && auth.role !== 'ROLE_SUPER_ADMIN')) {
//             return; // Do nothing if not an admin
//         }

//         console.log("Admin user detected, initializing notifications...");

//         // 1. Pehle saari existing complaints ko fetch karein
//         const fetchInitialComplaints = async () => {
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//                 const response = await axios.get('https://smart-eseva-backend.onrender.com/api/v1/admin/all-complaints', config);
//                 setComplaints(response.data);
//             } catch (error) {
//                 console.error("Failed to fetch initial complaints:", error);
//             }
//         };

//         fetchInitialComplaints();

//         // 2. Fir, live notifications ke liye connect karein
//         const eventSource = new EventSource("https://smart-eseva-backend.onrender.com/api/v1/notifications/subscribe");
        
//         eventSource.onopen = () => {
//             console.log("SSE Connection established for Admin.");
//         };

//         eventSource.addEventListener("new_complaint", (event) => {
//             const newComplaint = JSON.parse(event.data);
//             setComplaints(prevComplaints => [newComplaint, ...prevComplaints]);
//             toast.success(`New Complaint Received: ${newComplaint.ticketId}`);
//         });

//         eventSource.onerror = (err) => {
//             console.error("EventSource failed:", err);
//             eventSource.close();
//         };

//         // Clean up the connection on logout or component unmount
//         return () => {
//             console.log("Closing SSE Connection for Admin.");
//             eventSource.close();
//         };
//     }, [auth]); // Yeh effect tab chalega jab auth state change hogi

//     return (
//         <ComplaintContext.Provider value={{ complaints }}>
//             {children}
//         </ComplaintContext.Provider>
//     );
// };

// export default ComplaintContext;

import React, { createContext, useState, useEffect, useContext } from 'react';
import AuthContext from './AuthContext';
// Axios aur toast ki yahan zaroorat nahi hai, kyunki yeh context sirf SSE ke liye hai
// import axios from 'axios'; 
// import toast from 'react-hot-toast';

const ComplaintContext = createContext();

export const ComplaintProvider = ({ children }) => {
    // Is state ki ab zaroorat nahi hai, kyunki har page apna data fetch karega
    // const [complaints, setComplaints] = useState([]); 
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        // --- YEH HAI ASLI FIX ---
        // SSE connection sirf tabhi banega jab user Citizen ya Agent ho.
        if (!auth || (auth.role !== 'ROLE_CITIZEN' && auth.role !== 'ROLE_AGENT')) {
            console.log("SSE connection skipped for role:", auth?.role);
            return; // Admin/SuperAdmin ke liye kuchh mat karo
        }

        console.log("Citizen/Agent detected, initializing SSE notifications...");

        // --- TOKEN KO URL MEIN ADD KIYA ---
        const sseUrl = `https://smart-eseva-backend.onrender.com/api/v1/notifications/subscribe?token=${auth.token}`;
        
        // Ab, live notifications ke liye connect karein
        const eventSource = new EventSource(sseUrl);
        
        eventSource.onopen = () => {
            console.log("SSE Connection established for:", auth.role);
        };

        // Note: Yahan "new_complaint" waala listener hata diya hai,
        // kyunki woh sirf Admin ke liye tha. Citizen/Agent ke liye
        // "verification_code" aur "agent_assigned" waale listeners
        // unke apne components (Dashboard.js, AgentDashboardPage.js) mein hain.
        // Yeh context ab sirf ek "connection manager" ki tarah hai.

        eventSource.onerror = (err) => {
            console.error("SSE connection failed in ComplaintContext:", err);
            eventSource.close();
        };

        // Clean up the connection
        return () => {
            console.log("Closing SSE Connection from ComplaintContext.");
            eventSource.close();
        };
    }, [auth]); // Yeh effect tab chalega jab auth state change hogi

    // Context ab koi value provide nahi kar raha, sirf background mein kaam kar raha hai
    return (
        <ComplaintContext.Provider value={{}}>
            {children}
        </ComplaintContext.Provider>
    );
};

export default ComplaintContext;