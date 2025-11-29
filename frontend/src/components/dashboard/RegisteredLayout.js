// src/components/dashboard/RegisteredLayout.js

import React, { useState, useContext } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Fab,
  Divider,
  Tooltip,
  AppBar,
  Toolbar,
} from "@mui/material";
import {
  Dashboard,
  Person,
  Help,
  AddCircle,
  Logout,
  Menu,
  Add as AddIcon,
  Notifications,
  AccountCircle,
  DarkMode,
  LightMode,
} from "@mui/icons-material";
import AuthContext from "../../context/AuthContext";
import ForcePasswordChangeModal from "../common/ForcePasswordChangeModal";
import { useTheme } from "../../context/ThemeContext"; // 👈 same ThemeContext as visitor
import "./RegisteredLayout.css";

const drawerWidthOpen = 240;
const drawerWidthClosed = 72;

const RegisteredLayout = () => {
  const { auth, logout } = useContext(AuthContext);
  const { theme: appTheme, toggleTheme } = useTheme(); // light / dark from your ThemeContext

  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isFabHovered, setFabHovered] = useState(false);

  const handleDrawerToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Raise Complaint", icon: <AddCircle />, path: "/raise-complaint" },
    { text: "Profile", icon: <Person />, path: "/profile" },
    { text: "Help", icon: <Help />, path: "/help" },
  ];

  const drawerContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <Box className="flex items-center justify-between px-3 py-4">
        {isSidebarOpen && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-wide text-emerald-500">
              Smart E-Seva
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Citizen Panel
            </span>
          </div>
        )}
        <IconButton size="small" onClick={handleDrawerToggle}>
          <Menu fontSize="small" />
        </IconButton>
      </Box>

      <Divider />

      {/* Menu Items */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
              <Tooltip
                title={!isSidebarOpen ? item.text : ""}
                placement="right"
                arrow
              >
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: isSidebarOpen ? "initial" : "center",
                    px: 2.5,
                    borderRadius: "999px",
                    mx: 1.2,
                    mb: 0.5,
                    transition: "all 0.2s ease",
                    backgroundColor: active
                      ? appTheme === "dark"
                        ? "rgba(245, 158, 11, 0.15)" // amber-ish
                        : "rgba(16, 185, 129, 0.12)" // emerald-ish
                      : "transparent",
                    "&:hover": {
                      backgroundColor:
                        appTheme === "dark"
                          ? "rgba(245, 158, 11, 0.18)"
                          : "rgba(16, 185, 129, 0.16)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isSidebarOpen ? 2 : "auto",
                      justifyContent: "center",
                      color: active
                        ? appTheme === "dark"
                          ? "#f59e0b" // amber
                          : "#059669" // emerald
                        : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 500,
                    }}
                    sx={{
                      opacity: isSidebarOpen ? 1 : 0,
                      color: active
                        ? appTheme === "dark"
                          ? "#fbbf24"
                          : "#0f766e"
                        : undefined,
                    }}
                  />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      {/* Footer - Logout */}
      <Box sx={{ mt: "auto", mb: 1 }}>
        <Divider sx={{ mb: 0.5 }} />
        <List>
          <ListItem disablePadding>
            <Tooltip
              title={!isSidebarOpen ? "Logout" : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                onClick={logout}
                sx={{
                  mx: 1.2,
                  borderRadius: "999px",
                  color: "#ef4444",
                  "&:hover": { backgroundColor: "rgba(248, 113, 113, 0.12)" },
                }}
              >
                <ListItemIcon sx={{ color: "#ef4444", minWidth: 0, mr: isSidebarOpen ? 2 : "auto", justifyContent: "center" }}>
                  <Logout />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  primaryTypographyProps={{ fontSize: 14, fontWeight: 600 }}
                  sx={{ opacity: isSidebarOpen ? 1 : 0 }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </List>
      </Box>
    </div>
  );

  // If password change required, show only modal
  if (auth?.mustChangePassword) {
    return <ForcePasswordChangeModal />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-900 transition-colors duration-300">
      {/* TOP NAVBAR (GLASS) */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: `calc(100% - ${
            isSidebarOpen ? drawerWidthOpen : drawerWidthClosed
          }px)`,
          ml: isSidebarOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
          backgroundColor:
            appTheme === "dark"
              ? "rgba(15, 23, 42, 0.9)"
              : "rgba(248, 250, 252, 0.9)",
          backdropFilter: "blur(18px)",
          borderBottom:
            appTheme === "dark"
              ? "1px solid rgba(30, 64, 175, 0.4)"
              : "1px solid rgba(148, 163, 184, 0.5)",
          boxShadow:
            "0 10px 30px rgba(15,23,42,0.08), 0 1px 0 rgba(148,163,184,0.3)",
          transition: "all 0.2s ease",
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: 0.3,
            }}
          >
            Citizen Dashboard
          </Typography>

          {/* Theme Toggle */}
          <Tooltip title="Toggle Theme">
            <IconButton color="inherit" onClick={toggleTheme} sx={{ mr: 1 }}>
              {appTheme === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton color="inherit" sx={{ mr: 1 }}>
              <Notifications />
            </IconButton>
          </Tooltip>

          {/* Profile */}
          <Tooltip title={auth?.name || "Profile"}>
            <IconButton color="inherit" onClick={() => navigate("/profile")}>
              <AccountCircle />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR (DRAWER) */}
      <Drawer
        variant="permanent"
        sx={{
          width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isSidebarOpen ? drawerWidthOpen : drawerWidthClosed,
            boxSizing: "border-box",
            borderRight:
              appTheme === "dark"
                ? "1px solid rgba(30, 64, 175, 0.5)"
                : "1px solid rgba(148, 163, 184, 0.5)",
            background:
              appTheme === "dark"
                ? "radial-gradient(circle at top, #0f172a, #020617)"
                : "linear-gradient(to bottom, #f9fafb, #e5f9f3)",
            backdropFilter: "blur(16px)",
            paddingTop: "8px",
            paddingBottom: "8px",
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          width: `calc(100% - ${
            isSidebarOpen ? drawerWidthOpen : drawerWidthClosed
          }px)`,
          ml: isSidebarOpen ? `${drawerWidthOpen}px` : `${drawerWidthClosed}px`,
          pt: "88px",
          pb: "40px",
          px: { xs: 2, md: 4 },
          transition: "all 0.2s ease",
        }}
      >
        <Outlet />
      </Box>

      {/* FLOATING FAB - Raise Complaint */}
      <Fab
        variant={isFabHovered ? "extended" : "circular"}
        color="primary"
        aria-label="add-complaint"
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          background:
            appTheme === "dark"
              ? "linear-gradient(to right, #fbbf24, #f97316)"
              : "linear-gradient(to right, #10b981, #22c55e)",
          color: "#0f172a",
          boxShadow:
            "0 20px 40px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.25)",
          "&:hover": {
            boxShadow:
              "0 24px 50px rgba(15,23,42,0.45), 0 0 0 1px rgba(15,23,42,0.35)",
          },
        }}
        onMouseEnter={() => setFabHovered(true)}
        onMouseLeave={() => setFabHovered(false)}
        onClick={() => navigate("/raise-complaint")}
      >
        <AddIcon sx={{ mr: isFabHovered ? 1 : 0 }} />
        {isFabHovered && "Raise New Complaint"}
      </Fab>
    </div>
  );
};

export default RegisteredLayout;
