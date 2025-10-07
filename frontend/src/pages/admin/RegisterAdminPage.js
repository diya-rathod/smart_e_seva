import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal'; // Modal ko import karein
// We can reuse the same CSS file for a consistent look
import './RegisterCitizenPage.css'; 

const RegisterAdminPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        mobileNumber: '',
        dob: '',
        address: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // State to manage the modal
    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        isSuccess: false 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            setModalState({ isOpen: true, title: 'Error!', message: 'Passwords do not match!', isSuccess: false });
            return;
        }

        try {
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.post('http://localhost:8080/api/v1/admin/register-admin', formData, config);
            
            // On success, open the success modal
            setModalState({ isOpen: true, title: 'Success!', message: 'New Admin registered successfully!', isSuccess: true });

        } catch (error) {
            const errorMessage = error.response?.data || "Registration failed. Please try again.";
            // On error, open the error modal
            setModalState({ isOpen: true, title: 'Registration Failed!', message: errorMessage, isSuccess: false });
        }
    };
    
    const handleModalClose = () => { 
        const wasSuccess = modalState.isSuccess;
        setModalState({ isOpen: false, title: '', message: '', isSuccess: false });
        if (wasSuccess) {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div>
            <h1>Register a New Admin</h1>
            <div className="page-content-card">
                <form onSubmit={handleSubmit} className="register-citizen-form">
                    <div className="form-grid">
                        <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                        <div className="form-group"><label htmlFor="dob">Date of Birth</label><input type="date" id="dob" name="dob" onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="mobileNumber">Mobile Number</label><input type="text" id="mobileNumber" name="mobileNumber" onChange={handleChange} required /></div>
                        <div className="form-group form-span-2"><label htmlFor="address">Address (Optional)</label><textarea id="address" name="address" rows="3" onChange={handleChange}></textarea></div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register Admin</button>
                </form>

                {/* The Modal for showing success or error messages */}
                <Modal 
                    isOpen={modalState.isOpen} 
                    onClose={handleModalClose} 
                    onConfirm={handleModalClose} 
                    title={modalState.title} 
                    confirmText="OK" 
                    hideCancelButton={true}
                >
                    <p>{modalState.message}</p>
                </Modal>
            </div>
        </div>
    );
};

export default RegisterAdminPage;