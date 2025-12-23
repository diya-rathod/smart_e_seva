// // src/components/dashboard/RegisteredLayout.js

// import React, { useState, useContext } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//     Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
//     ListItemText, Typography, IconButton, Fab, Divider, Tooltip, AppBar, Toolbar
// } from '@mui/material';
// import { 
//     Dashboard, Person, Help, AddCircle, Logout, Menu, Add as AddIcon, Notifications, AccountCircle
// } from '@mui/icons-material';
// import AuthContext from '../../context/AuthContext';
// import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal';
// import './RegisteredLayout.css';

// const drawerWidthOpen = 240;
// const drawerWidthClosed = 70;

// const RegisteredLayout = () => {
//     const { auth,logout } = useContext(AuthContext);
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isSidebarOpen, setSidebarOpen] = useState(true);
//     const [isFabHovered, setFabHovered] = useState(false);

//     const handleDrawerToggle = () => {
//         setSidebarOpen(!isSidebarOpen);
//     };

//     const menuItems = [
//         { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
//         { text: 'Raise Complaint', icon: <AddCircle />, path: '/raise-complaint' },
//         { text: 'Profile', icon: <Person />, path: '/profile' },
//         { text: 'Help', icon: <Help />, path: '/help' },
//     ];

//     const drawerContent = (
//         <div className="sidebar-inner-container">
//             <div>
//                 <Box className="sidebar-header">
//                     {isSidebarOpen && (
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
//                             Smart E-Seva
//                         </Typography>
//                     )}
//                     <IconButton onClick={handleDrawerToggle}>
//                         <Menu />
//                     </IconButton>
//                 </Box>
//                 <Divider />
//                 <List>
//                     {menuItems.map((item) => (
//                         <ListItem key={item.text} disablePadding>
//                             <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right">
//                                 <ListItemButton
//                                     onClick={() => navigate(item.path)}
//                                     className={location.pathname === item.path ? 'active-link' : ''}
//                                 >
//                                     <ListItemIcon>{item.icon}</ListItemIcon>
//                                     <ListItemText 
//                                         primary={item.text} 
//                                         className={!isSidebarOpen ? 'sidebar-closed' : ''} 
//                                     />
//                                 </ListItemButton>
//                             </Tooltip>
//                         </ListItem>
//                     ))}
//                 </List>
//             </div>
//             <Box sx={{ marginTop: 'auto' }}>
//                 <List>
//                     <ListItem disablePadding>
//                         <Tooltip title={!isSidebarOpen ? "Logout" : ''} placement="right">
//                             <ListItemButton onClick={logout} sx={{ color: 'red' }}>
//                                 <ListItemIcon><Logout sx={{ color: 'red' }} /></ListItemIcon>
//                                 <ListItemText 
//                                     primary="Logout" 
//                                     className={!isSidebarOpen ? 'sidebar-closed' : ''} 
//                                 />
//                             </ListItemButton>
//                         </Tooltip>
//                     </ListItem>
//                 </List>
//             </Box>
//         </div>
//     );
    
//     return (
//         <> {/* <-- Naya Fragment Shuru */}

//             {/* --- YEH HAI NAYI CONDITION --- */}
//             {auth?.mustChangePassword ? (
//                 // Agar password change karna zaroori hai, to sirf modal dikhao
//                 <ForcePasswordChangeModal />
//             ) : (
//                 // Agar nahi, to poora normal layout dikhao
//                 <div className="layout-container">
//                     <AppBar 
//                         position="fixed"
//                         sx={{ 
//                             width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
//                             ml: isSidebarOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
//                             transition: (theme) => theme.transitions.create(['width', 'margin'], {
//                                 easing: theme.transitions.easing.sharp,
//                                 duration: theme.transitions.duration.enteringScreen,
//                             }),
//                         }}
//                     >
//                         <Toolbar>
//                             <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
//                                 Citizen Dashboard
//                             </Typography>
                            
//                             <Tooltip title="Notifications">
//                                 <IconButton color="inherit">
//                                     <Notifications />
//                                 </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Profile Settings">
//                                 <IconButton color="inherit" onClick={() => navigate('/profile')}>
//                                     <AccountCircle />
//                                 </IconButton>
//                             </Tooltip>
//                         </Toolbar>
//                     </AppBar>
                    
//                     <Drawer
//                         variant="permanent"
//                         className="sidebar-drawer"
//                         sx={{
//                             width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
//                             '& .MuiDrawer-paper': {
//                                 width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
//                                 transition: (theme) => theme.transitions.create('width', {
//                                     easing: theme.transitions.easing.sharp,
//                                     duration: theme.transitions.duration.enteringScreen,
//                                 }),
//                             },
//                         }}
//                         classes={{ paper: 'sidebar-paper' }}
//                         onMouseEnter={() => setSidebarOpen(true)}
//                         onMouseLeave={() => setSidebarOpen(false)}
//                     >
//                         {drawerContent}
//                     </Drawer>

//                     <Box
//                         component="main"
//                         className="main-content"
//                         sx={{ 
//                             width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
//                             paddingTop: '88px', 
//                         }}
//                     >
//                         <Outlet />
//                     </Box>

//                     <Fab 
//                         variant={isFabHovered ? "extended" : "circular"}
//                         color="primary" 
//                         aria-label="add-complaint" 
//                         className="extended-fab"
//                         sx={{ position: 'fixed', bottom: 40, right: 40 }}
//                         onMouseEnter={() => setFabHovered(true)}
//                         onMouseLeave={() => setFabHovered(false)}
//                         onClick={() => navigate('/raise-complaint')}
//                     >
//                         {isFabHovered ? <AddIcon sx={{ mr: 1 }} /> : <AddIcon />}
//                         {isFabHovered && "Raise New Complaint"}
//                     </Fab>
//                 </div>
//             )}
            

//         </> 
//     );
// };

// export default RegisteredLayout;





// src/components/dashboard/RegisteredLayout.js
// src/components/dashboard/RegisteredLayout.js

import React, { useState, useContext, useEffect } from 'react'; // 1. useEffect added
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { ListAlt } from '@mui/icons-material';
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, IconButton, Fab, Divider, Tooltip, AppBar, Toolbar
} from '@mui/material';
import { 
    Dashboard, Person, Help, AddCircle, Logout, Menu, Add as AddIcon, Notifications, AccountCircle
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext';
import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal';
import './RegisteredLayout.css';
import toast from 'react-hot-toast'; // 2. Toast added for Popup

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;
const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1'; // Live URL defined

const RegisteredLayout = () => {
    const { auth, logout } = useContext(AuthContext);
    if (!auth) {
        return null; 
    }
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isFabHovered, setFabHovered] = useState(false);

    // SSE State to manage connection
    const [sseConnection, setSseConnection] = useState(null);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // --- 3. NEW: LISTENER LOGIC ADDED HERE (Backend se OTP sunne ke liye) ---
    useEffect(() => {
        // Agar user login nahi hai, to connect mat karo
        if (!auth.token) return;

        const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;
        
        // Purana connection close karo agar exist karta hai
        if (sseConnection) {
            sseConnection.close();
        }

        const eventSource = new EventSource(sseUrl);
        setSseConnection(eventSource);

        eventSource.onopen = () => {
            console.log("Registered Layout: Notification Service Connected ✅");
        };

        // Backend bhej raha hai "verification_code", hum yahan sun rahe hain
        eventSource.addEventListener("verification_code", (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log("OTP Received:", data);

                // Custom Toast UI (Bada Popup)
                toast((t) => (
                    <div style={{minWidth: '250px', textAlign: 'center'}}>
                        <h3 style={{margin: '0 0 10px', color: '#2e7d32'}}>Work Completed! 🎉</h3>
                        <p style={{fontSize: '0.9rem', marginBottom: '10px'}}>
                            Agent has resolved Ticket: <strong>{data.ticketId}</strong>
                        </p>
                        <div style={{
                            background: '#f8f9fa', 
                            padding: '15px', 
                            borderRadius: '8px', 
                            border: '2px dashed #28a745',
                            fontWeight: 'bold', 
                            fontSize: '1.5rem', 
                            letterSpacing: '3px',
                            color: '#333'
                        }}>
                            {data.verificationCode}
                        </div>
                        <p style={{fontSize: '0.8rem', color: 'red', marginTop: '10px'}}>
                            Share this code with the agent ONLY if work is done.
                        </p>
                        <button onClick={() => toast.dismiss(t.id)} style={{
                            marginTop: '10px', padding: '8px 16px', border: 'none', 
                            background: '#007bff', color: 'white', borderRadius: '4px', cursor: 'pointer'
                        }}>
                            Close
                        </button>
                    </div>
                ), { duration: 30000, position: 'top-center' }); // 30 seconds tak rahega

            } catch (e) {
                console.error("Error parsing OTP notification", e);
            }
        });

        eventSource.onerror = (err) => {
            eventSource.close();
        };

        // Cleanup on unmount
        return () => {
            eventSource.close();
        };
    }, [auth.token]);
    // ---------------------------------------------------------------

    const menuItems = [
        { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
        // --- NEW ITEM ADDED ---
        { text: "My Complaints", icon: <ListAlt />, path: "/my-complaints" }, 
        // ----------------------
        { text: "Raise Complaint", icon: <AddCircle />, path: "/raise-complaint" },
        { text: "Profile", icon: <Person />, path: "/profile" },
        { text: "Help", icon: <Help />, path: "/help" },
    ];

    const drawerContent = (
        <div className="sidebar-inner-container">
            <div>
                <Box className="sidebar-header">
                    {isSidebarOpen && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Smart E-Seva
                        </Typography>
                    )}
                    <IconButton onClick={handleDrawerToggle}>
                        <Menu />
                    </IconButton>
                </Box>
                <Divider />
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right">
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    className={location.pathname === item.path ? 'active-link' : ''}
                                >
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText 
                                        primary={item.text} 
                                        className={!isSidebarOpen ? 'sidebar-closed' : ''} 
                                    />
                                </ListItemButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </List>
            </div>
            <Box sx={{ marginTop: 'auto' }}>
                <List>
                    <ListItem disablePadding>
                        <Tooltip title={!isSidebarOpen ? "Logout" : ''} placement="right">
                            <ListItemButton onClick={logout} sx={{ color: 'red' }}>
                                <ListItemIcon><Logout sx={{ color: 'red' }} /></ListItemIcon>
                                <ListItemText 
                                    primary="Logout" 
                                    className={!isSidebarOpen ? 'sidebar-closed' : ''} 
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
            </Box>
        </div>
    );
    
    return (
        <> 
            {auth?.mustChangePassword ? (
                <ForcePasswordChangeModal />
            ) : (
                <div className="layout-container">
                    <AppBar 
                        position="fixed"
                        sx={{ 
                            width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
                            ml: isSidebarOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
                            transition: (theme) => theme.transitions.create(['width', 'margin'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                        }}
                    >
                        <Toolbar>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                                Citizen Dashboard
                            </Typography>
                            
                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Notifications />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Profile Settings">
                                <IconButton color="inherit" onClick={() => navigate('/profile')}>
                                    <AccountCircle />
                                </IconButton>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    
                    <Drawer
                        variant="permanent"
                        className="sidebar-drawer"
                        sx={{
                            width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
                            '& .MuiDrawer-paper': {
                                width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
                                transition: (theme) => theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                            },
                        }}
                        classes={{ paper: 'sidebar-paper' }}
                        onMouseEnter={() => setSidebarOpen(true)}
                        onMouseLeave={() => setSidebarOpen(false)}
                    >
                        {drawerContent}
                    </Drawer>

                    <Box
                        component="main"
                        className="main-content"
                        sx={{ 
                            width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
                            paddingTop: '88px', 
                        }}
                    >
                        <Outlet />
                    </Box>

                    <Fab 
                        variant={isFabHovered ? "extended" : "circular"}
                        color="primary" 
                        aria-label="add-complaint" 
                        className="extended-fab"
                        sx={{ position: 'fixed', bottom: 40, right: 40 }}
                        onMouseEnter={() => setFabHovered(true)}
                        onMouseLeave={() => setFabHovered(false)}
                        onClick={() => navigate('/raise-complaint')}
                    >
                        {isFabHovered ? <AddIcon sx={{ mr: 1 }} /> : <AddIcon />}
                        {isFabHovered && "Raise New Complaint"}
                    </Fab>
                </div>
            )} 
        </> 
    );
};

export default RegisteredLayout;