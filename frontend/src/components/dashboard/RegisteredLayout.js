// src/components/dashboard/RegisteredLayout.js

import React, { useState, useContext } from 'react';
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

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

const RegisteredLayout = () => {
    const { auth,logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isFabHovered, setFabHovered] = useState(false);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

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
        <> {/* <-- Naya Fragment Shuru */}

            {/* --- YEH HAI NAYI CONDITION --- */}
            {auth?.mustChangePassword ? (
                // Agar password change karna zaroori hai, to sirf modal dikhao
                <ForcePasswordChangeModal />
            ) : (
                // Agar nahi, to poora normal layout dikhao
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