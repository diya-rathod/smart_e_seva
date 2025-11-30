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

import React, { useState, useContext, useEffect } from 'react'; // useEffect add kiya
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
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
import toast from 'react-hot-toast'; // Toast import kiya notification ke liye

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;
const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1'; // URL Define kiya

const RegisteredLayout = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isFabHovered, setFabHovered] = useState(false);
    
    // --- SSE State ---
    const [sseConnection, setSseConnection] = useState(null);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // --- 1. NOTIFICATION LISTENER LOGIC (Citizen Side) ---
    useEffect(() => {
        if (!auth.token) return;

        // Connection URL with Token
        const sseUrl = `${API_BASE_URL}/notifications/subscribe?token=${auth.token}`;

        // Close existing connection if any
        if (sseConnection) {
            sseConnection.close();
        }

        const eventSource = new EventSource(sseUrl);
        setSseConnection(eventSource);

        eventSource.onopen = () => {
            console.log("Citizen Notification Service Connected ✅");
        };

        // --- SPECIFIC LISTENER FOR OTP ---
        // Backend se hum "verification_code" event bhej rahe hain
        eventSource.addEventListener("verification_code", (event) => {
            try {
                const data = JSON.parse(event.data);
                // Custom Toast for OTP
                toast((t) => (
                    <div style={{minWidth: '250px'}}>
                        <h4 style={{margin: '0 0 5px', color: '#2e7d32'}}>Work Completed! ✅</h4>
                        <p style={{margin: '0 0 10px', fontSize: '0.9rem'}}>
                            Agent has resolved your issue (Ticket: {data.ticketId}).
                        </p>
                        <div style={{background: '#f1f1f1', padding: '10px', borderRadius: '5px', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem', letterSpacing: '2px'}}>
                            OTP: {data.verificationCode}
                        </div>
                        <p style={{fontSize: '0.8rem', color: 'gray', marginTop: '5px'}}>Share this code with agent.</p>
                        <button onClick={() => toast.dismiss(t.id)} style={{marginTop: '5px', padding: '5px 10px', border: 'none', background: '#333', color: 'white', borderRadius: '3px', cursor: 'pointer'}}>
                            Dismiss
                        </button>
                    </div>
                ), { duration: 20000, position: 'top-center' }); // 20 seconds tak dikhega

            } catch (e) {
                console.error("Error parsing OTP notification", e);
            }
        });

        // --- GENERIC LISTENER (Optional for other alerts) ---
        eventSource.addEventListener("notification", (event) => {
            // General alerts ke liye
            const data = JSON.parse(event.data);
            if(data.type !== 'OTP') { // OTP wala duplicate na ho
                toast(data.message, { icon: '🔔' });
            }
        });

        eventSource.onerror = (err) => {
            // console.error("SSE Error", err); // Silent error keep console clean
            eventSource.close();
        };

        return () => {
            eventSource.close();
        };
    }, [auth.token]);
    // -----------------------------------------------------

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Raise Complaint', icon: <AddCircle />, path: '/raise-complaint' },
        { text: 'Profile', icon: <Person />, path: '/profile' },
        { text: 'Help', icon: <Help />, path: '/help' },
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