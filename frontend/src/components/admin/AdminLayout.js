// import React, { useState, useContext } from 'react';
// import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { 
//     Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
//     ListItemText, Typography, IconButton, Divider, Tooltip, AppBar, Toolbar 
// } from '@mui/material';
// import { 
//     Dashboard, // Dashboard Icon
//     GroupAdd as RegisterCitizenIcon, // Register Citizen Icon
//     SupportAgent as RegisterAgentIcon, // Register Agent Icon
//     ListAlt as ManageComplaintsIcon, // Manage Complaints Icon
//     AdminPanelSettings as RegisterAdminIcon, // Register Admin Icon
//     AssignmentLate as NewComplaintsIcon,
//     People as ManageUsersIcon,
//     AdminPanelSettings as ManageAdminsIcon,
//     AssignmentInd as AssignAgentIcon, // <-- Naya Icon
//     Logout, 
//     Menu, 
//     Notifications,
//     Map as MapIcon, 
//     AccountCircle // Profile Icon
// } from '@mui/icons-material';
// import AuthContext from '../../context/AuthContext'; // Path check kar lena
// import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal'; // Import the modal
// import '../dashboard/RegisteredLayout.css'; // Citizen waali CSS hi use kar rahe hain

// const drawerWidthOpen = 240;
// const drawerWidthClosed = 70;

// const AdminLayout = () => { // Component ka naam badal diya
//     const { auth, logout } = useContext(AuthContext); // 'auth' ko get kiya
//     const navigate = useNavigate();
//     const location = useLocation();
//     const [isSidebarOpen, setSidebarOpen] = useState(true);

//     const handleDrawerToggle = () => {
//         setSidebarOpen(!isSidebarOpen);
//     };

//     // --- ADMIN KE SIDEBAR LINKS ---
//     const menuItems = [
//         { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
//         { text: 'New Complaints', icon: <NewComplaintsIcon />, path: '/admin/new-complaints' },
//         { text: 'Manage Complaints', icon: <ManageComplaintsIcon />, path: '/admin/manage-complaints' },
//         { text: 'Register Citizen', icon: <RegisterCitizenIcon />, path: '/admin/register-citizen' },
//         { text: 'Register Agent', icon: <RegisterAgentIcon />, path: '/admin/register-agent' },
//         { text: 'Manage Citizens', icon: <ManageUsersIcon />, path: '/admin/manage-citizens' },
//         { text: 'Manage Agents', icon: <ManageUsersIcon />, path: '/admin/manage-agents' },
//         { text: 'Live Map', icon: <MapIcon />, path: '/admin/live-map' }, // <-- Naya Link
        
//         // Conditional link for Super Admin
//         ...(auth?.role === 'ROLE_SUPER_ADMIN' ? 
//             [
//             { text: 'Register Admin', icon: <RegisterAdminIcon />, path: '/admin/register-admin' },
//             { text: 'Manage Admins', icon: <ManageAdminsIcon />, path: '/admin/manage-admins' }
//             ] 
//             : []
            
//         )
//     ];

//     const drawerContent = (
//         <div className="sidebar-inner-container">
//             <div>
//                 <Box className="sidebar-header">
//                     {isSidebarOpen && (
//                         <Typography variant="h6" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
//                             Admin Panel
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
//         <> {/* <-- Fragment Shuru */}
//             {/* --- FORCE PASSWORD CHANGE LOGIC --- */}
//             {auth?.mustChangePassword ? (
//                 <ForcePasswordChangeModal />
//             ) : (
//                 // Normal Layout
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
//                                 Admin Dashboard
//                             </Typography>
                            
//                             {/* --- YEH HAI NAYA CONDITIONAL LOGIC --- */}
//                             {location.pathname === '/admin/live-map' ? (
//                                 // Agar Live Map page par hain, to yeh icons dikhao
//                                 <>
//                                     <Tooltip title="New Complaints"> 
//                                         <IconButton color="inherit" onClick={() => navigate('/admin/new-complaints')}>
//                                             <NewComplaintsIcon />
//                                         </IconButton>
//                                     </Tooltip>
                                    
//                                 </>
//                             ) : (
//                                 // Baaki sabhi pages par, yeh icons dikhao
//                                 <>
                                    
//                                     <Tooltip title="Live Complaints Map"> 
//                                         <IconButton color="inherit" onClick={() => navigate('/admin/live-map')}>
//                                             <MapIcon />
//                                         </IconButton>
//                                     </Tooltip>
//                                 </>
//                             )}
                            
//                             {/* Profile icon hamesha dikhega */}
//                             <Tooltip title="Notifications">
//                                         <IconButton color="inherit">
//                                             <Notifications />
//                                         </IconButton>
//                                     </Tooltip>
//                             <Tooltip title="Profile Settings"> 
//                                 <IconButton color="inherit" onClick={() => navigate('/admin/profile')}>
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
                    
//                     {/* --- FAB HATA DIYA GAYA HAI --- */}
                    
//                 </div>
//             )} 
//         </> 
//     );
// };

// export default AdminLayout;






import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { 
    Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, 
    ListItemText, Typography, IconButton, Divider, Tooltip, AppBar, Toolbar, Avatar 
} from '@mui/material';
import { 
    Dashboard, 
    GroupAdd as RegisterCitizenIcon, 
    SupportAgent as RegisterAgentIcon, 
    ListAlt as ManageComplaintsIcon, 
    AdminPanelSettings as RegisterAdminIcon, 
    AssignmentLate as NewComplaintsIcon,
    People as ManageUsersIcon,
    AdminPanelSettings as ManageAdminsIcon,
    AssignmentInd as AssignAgentIcon,
    Logout, 
    Menu, 
    Notifications,
    Map as MapIcon, 
    AccountCircle 
} from '@mui/icons-material';
import AuthContext from '../../context/AuthContext'; 
import ForcePasswordChangeModal from '../common/ForcePasswordChangeModal'; 
import '../dashboard/RegisteredLayout.css'; 

const drawerWidthOpen = 260; // Slightly wider for better look
const drawerWidthClosed = 80;

const AdminLayout = () => { 
    const { auth, logout } = useContext(AuthContext); 
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleDrawerToggle = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
        { text: 'New Complaints', icon: <NewComplaintsIcon />, path: '/admin/new-complaints' },
        { text: 'Manage Complaints', icon: <ManageComplaintsIcon />, path: '/admin/manage-complaints' },
        { text: 'Register Citizen', icon: <RegisterCitizenIcon />, path: '/admin/register-citizen' },
        { text: 'Register Agent', icon: <RegisterAgentIcon />, path: '/admin/register-agent' },
        { text: 'Manage Citizens', icon: <ManageUsersIcon />, path: '/admin/manage-citizens' },
        { text: 'Manage Agents', icon: <ManageUsersIcon />, path: '/admin/manage-agents' },
        { text: 'Live Map', icon: <MapIcon />, path: '/admin/live-map' }, 
        
        ...(auth?.role === 'ROLE_SUPER_ADMIN' ? 
            [
            { text: 'Register Admin', icon: <RegisterAdminIcon />, path: '/admin/register-admin' },
            { text: 'Manage Admins', icon: <ManageAdminsIcon />, path: '/admin/manage-admins' }
            ] 
            : []
        )
    ];

    const drawerContent = (
        <div className="h-full flex flex-col bg-slate-900 text-slate-300">
            {/* Header */}
            <div className="p-6 flex items-center justify-between">
                {isSidebarOpen && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">S</span>
                        </div>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', letterSpacing: '0.5px' }}>
                            Smart E-Seva
                        </Typography>
                    </div>
                )}
                <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
                    <Menu />
                </IconButton>
            </div>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
            
            {/* Menu Items */}
            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                <List disablePadding>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                                <Tooltip title={!isSidebarOpen ? item.text : ''} placement="right">
                                    <ListItemButton
                                        onClick={() => navigate(item.path)}
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: isSidebarOpen ? 'initial' : 'center',
                                            px: 2.5,
                                            borderRadius: '12px',
                                            backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent', // Emerald tint
                                            color: isActive ? '#34D399' : '#94A3B8', // Emerald text vs Slate text
                                            '&:hover': {
                                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                                color: '#fff',
                                            },
                                        }}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 0,
                                                mr: isSidebarOpen ? 2 : 'auto',
                                                justifyContent: 'center',
                                                color: 'inherit',
                                            }}
                                        >
                                            {item.icon}
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={item.text} 
                                            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400 }}
                                            sx={{ opacity: isSidebarOpen ? 1 : 0 }} 
                                        />
                                    </ListItemButton>
                                </Tooltip>
                            </ListItem>
                        );
                    })}
                </List>
            </div>

            {/* Footer / Logout */}
            <div className="p-3 border-t border-slate-800">
                <List disablePadding>
                    <ListItem disablePadding>
                        <Tooltip title={!isSidebarOpen ? "Logout" : ''} placement="right">
                            <ListItemButton 
                                onClick={logout} 
                                sx={{ 
                                    borderRadius: '12px',
                                    color: '#F87171', // Red for logout
                                    '&:hover': { backgroundColor: 'rgba(248, 113, 113, 0.1)' }
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 0, mr: isSidebarOpen ? 2 : 'auto', color: '#F87171' }}>
                                    <Logout />
                                </ListItemIcon>
                                <ListItemText primary="Logout" sx={{ opacity: isSidebarOpen ? 1 : 0 }} />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                </List>
            </div>
        </div>
    );
    
    return (
        <> 
            {auth?.mustChangePassword ? (
                <ForcePasswordChangeModal />
            ) : (
                <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8FAFC' }}> {/* Light Slate BG */}
                    
                    {/* --- BACKGROUND BLOBS (Purely Decorative) --- */}
                    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
                    </div>

                    <AppBar 
                        position="fixed"
                        elevation={0}
                        sx={{ 
                            width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
                            ml: isSidebarOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
                            transition: (theme) => theme.transitions.create(['width', 'margin'], {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.enteringScreen,
                            }),
                            bgcolor: 'rgba(255, 255, 255, 0.8)', // Glassmorphism
                            backdropFilter: 'blur(12px)',
                            borderBottom: '1px solid rgba(0,0,0,0.05)',
                            color: '#1E293B' // Slate-800 Text
                        }}
                    >
                        <Toolbar>
                            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                                Admin Dashboard
                            </Typography>
                            
                            {/* --- HEADER ICONS --- */}
                            <div className="flex items-center gap-2">
                                {location.pathname === '/admin/live-map' ? (
                                    <Tooltip title="New Complaints"> 
                                        <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid #E2E8F0' }} onClick={() => navigate('/admin/new-complaints')}>
                                            <NewComplaintsIcon color="primary" />
                                        </IconButton>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Live Complaints Map"> 
                                        <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid #E2E8F0' }} onClick={() => navigate('/admin/live-map')}>
                                            <MapIcon sx={{ color: '#10B981' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                
                                <Tooltip title="Notifications">
                                    <IconButton size="small" sx={{ bgcolor: 'white', border: '1px solid #E2E8F0' }}>
                                        <Notifications sx={{ color: '#64748B' }} />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Profile Settings"> 
                                    <IconButton onClick={() => navigate('/admin/profile')} sx={{ ml: 1 }}>
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: '#10B981' }}>A</Avatar>
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Toolbar>
                    </AppBar>
                    
                    <Drawer
                        variant="permanent"
                        sx={{
                            width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                            boxSizing: 'border-box',
                            '& .MuiDrawer-paper': {
                                width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
                                transition: (theme) => theme.transitions.create('width', {
                                    easing: theme.transitions.easing.sharp,
                                    duration: theme.transitions.duration.enteringScreen,
                                }),
                                borderRight: 'none',
                                overflowX: 'hidden',
                                bgcolor: '#0F172A', // Match Dark Sidebar
                            },
                        }}
                    >
                        {drawerContent}
                    </Drawer>

                    <Box
                        component="main"
                        sx={{ 
                            flexGrow: 1, 
                            p: 3, 
                            width: `calc(100% - ${isSidebarOpen ? drawerWidthOpen : drawerWidthClosed}px)`,
                            mt: '64px', // AppBar height
                            zIndex: 1, // Above background
                            position: 'relative'
                        }}
                    >
                        <Outlet />
                    </Box>
                </Box>
            )} 
        </> 
    );
};

export default AdminLayout;