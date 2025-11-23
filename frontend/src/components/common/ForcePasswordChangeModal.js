import React, { useState, useContext } from 'react';
import { 
    Box, Modal, Card, CardContent, Typography, TextField, 
    Button, CircularProgress 
} from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext'; // Path check kar lena

// API base URL
const API_BASE_URL = 'https://smart-eseva-backend.onrender.com/api/v1';

// Modal ko screen ke center mein rakhne ke liye style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450, // Modal ki width
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '8px',
};

const ForcePasswordChangeModal = () => {
    const { auth, passwordChangedSuccessfully } = useContext(AuthContext);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- Validation ---
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error("New passwords do not match!");
            return;
        }
        if (passwords.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long.");
            return;
        }
        
        setLoading(true);
        const toastId = toast.loading('Changing password...');

        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            // --- YEH WAHI API HAI JO HUMNE BANAYI THI ---
            await axios.post(`${API_BASE_URL}/users/change-password`, {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
                confirmPassword: passwords.confirmPassword
            }, config);

            toast.success('Password changed successfully! Welcome to Smart E-Seva.', { id: toastId });
            
            // --- YEH SABSE IMPORTANT HAI ---
            // AuthContext ko batao ki password badal gaya hai
            passwordChangedSuccessfully(); 
            // Ab AuthContext mein 'mustChangePassword' false ho gaya hai
            // Parent component (RegisteredLayout) is change ko dekhega aur is modal ko hata dega

        } catch (error) {
            console.error("Failed to change password:", error);
            toast.error(error.response?.data || 'Failed to change password.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            open={true} // Yeh modal hamesha khula rahega (jab tak render ho raha hai)
            // --- Ismein onClose prop nahi hai, taaki user isko band na kar sake ---
        >
            <Box sx={style}>
                <Card component="form" onSubmit={handleSubmit}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Please Update Your Password
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            For security reasons, you must change your default password before you can continue.
                        </Typography>
                        
                        <TextField 
                            fullWidth 
                            required
                            type="password" 
                            label="Current Password" 
                            name="currentPassword"
                            value={passwords.currentPassword}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField 
                            fullWidth 
                            required
                            type="password" 
                            label="New Password" 
                            name="newPassword"
                            value={passwords.newPassword}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField 
                            fullWidth 
                            required
                            type="password" 
                            label="Confirm New Password" 
                            name="confirmPassword"
                            value={passwords.confirmPassword}
                            onChange={handleChange}
                            sx={{ mb: 3 }}
                        />
                        
                        <Button 
                            type="submit" 
                            variant="contained" 
                            fullWidth
                            disabled={loading}
                            size="large"
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Set New Password & Continue'}
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    );
};

export default ForcePasswordChangeModal;