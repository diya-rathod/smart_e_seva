import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, IconButton, Divider, Tooltip, AppBar, Toolbar 
} from '@mui/material';
import { 
    Dashboard, // Dashboard Icon
    Assignment as MyComplaintsIcon, // Icon for Assigned Complaints
    Logout, 
    Menu, 
    Notifications, 
    AccountCircle // Profile Icon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext'; // Path check kar lena
import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal'; // Import the modal
import '../dashboard/RegisteredLayout.css'; // Citizen/Admin waali CSS hi use kar rahe hain

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

const AgentLayout = () => { // Component ka naam badal diya
    const { auth, logout } = useContext(AuthContext); // 'auth' ko get kiya
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // --- AGENT KE SIDEBAR LINKS ---
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/agent/dashboard' },
        
        // Aap yahan aur links add kar sakte ho, jaise "Completed Tasks" etc.
        // Example: { text: 'My Complaints', icon: <MyComplaintsIcon />, path: '/agent/my-complaints' } 
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
        <> {/* <-- Fragment Shuru */}
            {/* --- FORCE PASSWORD CHANGE LOGIC --- */}
            {auth?.mustChangePassword ? (
                <ForcePasswordChangeModal />
            ) : (
                // Normal Layout
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
                                Agent Dashboard {/* <-- Title Badla */}
                            </Typography>
                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Notifications />
                                </IconButton>
                            </Tooltip>
                            {/* Agent ke liye Profile page ka path check kar lena */}
                            <Tooltip title="Profile Settings">
                                <IconButton color="inherit" onClick={() => navigate('/agent/profile')}> {/* <-- Path update karna pad sakta hai */}
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
                    
                    {/* --- FAB HATA DIYA GAYA HAI --- */}
                    
                </div>
            )} 
        </> 
    );
};

export default AgentLayout;