import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, IconButton, Divider, Tooltip, AppBar, Toolbar 
} from '@mui/material';
import { 
    Dashboard, // Dashboard Icon
    GroupAdd as RegisterCitizenIcon, // Register Citizen Icon
    SupportAgent as RegisterAgentIcon, // Register Agent Icon
    ListAlt as ManageComplaintsIcon, // Manage Complaints Icon
    AdminPanelSettings as RegisterAdminIcon, // Register Admin Icon
    Logout, 
    Menu, 
    Notifications, 
    AccountCircle // Profile Icon
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext'; // Path check kar lena
import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal'; // Import the modal
import '../dashboard/RegisteredLayout.css'; // Citizen waali CSS hi use kar rahe hain

const drawerWidthOpen = 240;
const drawerWidthClosed = 70;

const AdminLayout = () => { // Component ka naam badal diya
    const { auth, logout } = useContext(AuthContext); // 'auth' ko get kiya
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    // --- ADMIN KE SIDEBAR LINKS ---
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'Manage Complaints', icon: <ManageComplaintsIcon />, path: '/admin/manage-complaints' },
        { text: 'Register Citizen', icon: <RegisterCitizenIcon />, path: '/admin/register-citizen' },
        { text: 'Register Agent', icon: <RegisterAgentIcon />, path: '/admin/register-agent' },
        
        // Conditional link for Super Admin
        ...(auth?.role === 'ROLE_SUPER_ADMIN' ? 
            [{ text: 'Register Admin', icon: <RegisterAdminIcon />, path: '/admin/register-admin' }] 
            : []
        )
    ];

    const drawerContent = (
        <div className="sidebar-inner-container">
            <div>
                <Box className="sidebar-header">
                    {isSidebarOpen && (
                        <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                            Admin Panel
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
                                Admin Dashboard {/* <-- Title Badla */}
                            </Typography>
                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Notifications />
                                </IconButton>
                            </Tooltip>
                            {/* Admin ke liye Profile page ka path check kar lena */}
                            <Tooltip title="Profile Settings"> 
                                <IconButton color="inherit" onClick={() => navigate('/admin/profile')}> {/* <-- Path update karna pad sakta hai */}
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

export default AdminLayout;