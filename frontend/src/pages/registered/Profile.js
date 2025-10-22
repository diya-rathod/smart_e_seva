import React, { useState, useEffect, useContext } from 'react';
import {
  Box, Grid, Card, CardHeader, CardContent, TextField, Button,
  Typography, Divider, FormControlLabel, Switch, Avatar, CircularProgress, Tooltip, IconButton
} from '@mui/material';
// --- FIX: Hum 'Save' aur 'Edit' icons use nahi kar rahe ---
// import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

// API base URL
const API_BASE_URL = 'http://localhost:8080/api/v1';

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  // --- NAYA STATE: Password section ko dikhaane/chhipaane ke liye ---
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  // --- REMOVED: isEditing waala state hata diya ---
  const [loading, setLoading] = useState(true);

  // --- 1. Fetch Profile Data on Load ---
  useEffect(() => {
    const fetchProfile = async () => {
      if (!auth.token) return;
      setLoading(true);
      try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        const { data } = await axios.get(`${API_BASE_URL}/users/me`, config);
        setProfile({
          name: data.name || '',
          email: data.email || '',
          mobileNumber: data.mobileNumber || '',
          meterNumber: data.meterNumber || ''
        });
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Could not load your profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [auth.token]);

  // --- 2. Password Input Handler ---
  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // --- REMOVED: handleProfileChange aur handleProfileSave functions hata diye ---

  // --- 3. Handle Password Change ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (passwords.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    const toastId = toast.loading('Changing password...');
    try {
      const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
      await axios.post(`${API_BASE_URL}/users/change-password`, {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
        confirmPassword: passwords.confirmPassword
      }, config);

      toast.success('Password changed successfully!', { id: toastId });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setShowPasswordFields(false); // Form ko wapas chhipa do
    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error.response?.data?.message || 'Failed to change password.', { id: toastId });
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Profile & Settings
      </Typography>

      <Grid container spacing={3}>

        {/* --- LEFT COLUMN (Forms) --- */}
        <Grid item xs={12} md={8}>
          {/* 1. Personal Information Card (Ab Read-Only) */}
          <Card>
            <CardHeader
              title="Personal Information"
            // --- REMOVED: Edit button hata diya ---
            />
            <Divider />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={profile.name}
                    disabled // <-- FIELD DISABLED
                    InputProps={{ readOnly: true }} // <-- READ ONLY
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    value={profile.email}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={profile.mobileNumber}
                    disabled // <-- FIELD DISABLED
                    InputProps={{ readOnly: true }} // <-- READ ONLY
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Meter Number"
                    name="meterNumber"
                    value={profile.meterNumber}
                    disabled
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>
              {/* --- REMOVED: Save/Cancel buttons hata diye --- */}
            </CardContent>
          </Card>

          {/* 2. Security (Change Password) Card */}
          {/* --- NAYA FIX: Button add kiya --- */}
          {!showPasswordFields && (
            <Box sx={{ mt: 3 }}>
              <Button variant="contained" onClick={() => setShowPasswordFields(true)}>
                Change Password
              </Button>
            </Box>
          )}

          {/* --- NAYA FIX: Yeh poora card ab conditional hai --- */}
          {showPasswordFields && (
            <Card component="form" onSubmit={handleChangePassword} sx={{ mt: 3 }}>
              <CardHeader title="Security" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Current Password"
                      name="currentPassword"
                      value={passwords.currentPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="New Password"
                      name="newPassword"
                      value={passwords.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      type="password"
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwords.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                  </Grid>
                </Grid>
              </CardContent>
              <Divider />
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button onClick={() => setShowPasswordFields(false)} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">Change Password</Button>
              </Box>
            </Card>
          )}
        </Grid>

        {/* --- RIGHT COLUMN (Picture & Notifications) --- */}
        <Grid item xs={12} md={4}>
          {/* 3. Profile Picture Card */}
          <Card>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Avatar sx={{ width: 100, height: 100, mb: 2, fontSize: '3rem' }}>
                {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
              </Avatar>
              <Typography variant="h6">{profile.name}</Typography>
              <Typography variant="body2" color="text.secondary">{profile.email}</Typography>
              <Button variant="contained" component="label" sx={{ mt: 2 }}>
                Upload Picture
                <input type="file" hidden />
              </Button>
            </CardContent>
          </Card>

          {/* 4. Notification Preferences Card */}
          {/* <Card sx={{ mt: 3 }}>
                        <CardHeader title="Notification Preferences" />
                        <Divider />
                        <CardContent>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <FormControlLabel 
                                    control={<Switch defaultChecked name="email" />} 
                                    label="Email Notifications" 
                                />
                                <FormControlLabel 
                                    control={<Switch name="sms" />} 
                                    label="SMS Notifications" 
                                />
                                <FormControlLabel 
                                    control={<Switch defaultChecked name="push" />} 
                                    label="Push Notifications" 
                                />
                            </Box>
                        </CardContent>
                    </Card> */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;