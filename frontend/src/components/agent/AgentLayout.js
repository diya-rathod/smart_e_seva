import React, { useState, useContext, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios'; // API call ke liye
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, IconButton, Divider, Tooltip, AppBar, Toolbar,
    Badge, Menu, MenuItem // <-- New Imports for Notification UI
} from '@mui/material';
import { 
    Dashboard, 
    Assignment as MyComplaintsIcon, 
    Logout, 
    Menu as MenuIcon, // Alias diya kyuki Menu component bhi import kiya hai
    Notifications, 
    AccountCircle 
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext'; 
import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal'; 
import '../dashboard/RegisteredLayout.css'; 

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;
const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1'; // Backend URL

const AgentLayout = () => { 
    const { auth, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // --- NEW NOTIFICATION STATE ---
    const [notifications, setNotifications] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null); // Menu control
    const isMenuOpen = Boolean(anchorEl);

    // --- 1. Fetch Notifications Logic ---
    const fetchNotifications = async () => {
        if (!auth.token) return;
        try {
            // Backend API call
            const res = await axios.get(`${API_BASE_URL}/notifications/my-notifications`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            setNotifications(res.data);
        } catch (error) {
            console.error("Failed to load notifications", error);
            // App crash na ho isliye error ignore kar rahe hain (silent fail)
        }
    };

    // --- 2. Auto-Fetch Every 30 Seconds ---
    useEffect(() => {
        fetchNotifications(); // Initial load
        const interval = setInterval(fetchNotifications, 30000); // Polling
        return () => clearInterval(interval);
    }, [auth.token]);

    // --- Menu Handlers ---
    const handleNotificationClick = (event) => {
        setAnchorEl(event.currentTarget);
        // Optional: Yahan "Mark as Read" API call kar sakte hain future mein
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // Calculate Unread Count
    const unreadCount = notifications.filter(n => !n.read).length;

    // --- AGENT SIDEBAR LINKS ---
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/agent/dashboard' },
    ];

    const drawerContent = (
        <div className="sidebar-inner-container">
            <div>
                <Box className="sidebar-header">
                    {isSidebarOpen && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Agent Portal
                        </Typography>
                    )}
                    <IconButton onClick={handleDrawerToggle}>
                        <MenuIcon />
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
                                Agent Dashboard
                            </Typography>
                            
                            {/* --- NOTIFICATION SECTION START --- */}
                            <Tooltip title="Notifications">
                                <IconButton color="inherit" onClick={handleNotificationClick}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            {/* Dropdown Menu */}
                            <Menu
                                anchorEl={anchorEl}
                                open={isMenuOpen}
                                onClose={handleMenuClose}
                                PaperProps={{
                                    style: { maxHeight: 400, width: '350px' },
                                }}
                            >
                                <MenuItem disabled style={{fontWeight: 'bold', borderBottom: '1px solid #ddd'}}>
                                    Recent Notifications
                                </MenuItem>
                                
                                {notifications.length === 0 ? (
                                    <MenuItem onClick={handleMenuClose}>No new notifications</MenuItem>
                                ) : (
                                    notifications.map((notif) => (
                                        <MenuItem 
                                            key={notif.id} 
                                            onClick={handleMenuClose}
                                            style={{
                                                whiteSpace: 'normal',
                                                borderBottom: '1px solid #f0f0f0',
                                                backgroundColor: notif.read ? 'white' : '#f0f8ff'
                                            }}
                                        >
                                            <div style={{display:'flex', flexDirection:'column'}}>
                                                <Typography variant="body2">{notif.message}</Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {new Date(notif.timestamp).toLocaleString()}
                                                </Typography>
                                            </div>
                                        </MenuItem>
                                    ))
                                )}
                            </Menu>
                            {/* --- NOTIFICATION SECTION END --- */}

                            <Tooltip title="Profile Settings">
                                <IconButton color="inherit" onClick={() => navigate('/agent/profile')}>
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
                </div>
            )} 
        </> 
    );
};

export default AgentLayout;