import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal'; // Import the Modal component
import './RegisterCitizenPage.css'; // We can reuse the same CSS

const RegisterAgentPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', dob: '',
        mobileNumber: '', employeeId: '', status: 'Active', division: ''
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
            await axios.post('http://localhost:8080/api/v1/admin/register-agent', formData, config);
            
            // On success, open the success modal
            setModalState({ isOpen: true, title: 'Success!', message: 'Agent registered successfully!', isSuccess: true });

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
            <h1>Register a New Agent</h1>
            <div className="page-content-card">
                <form onSubmit={handleSubmit} className="register-citizen-form">
                    <div className="form-grid">
                        {/* Your form fields for the agent go here... */}
                        <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                        <div className="form-group"><label htmlFor="dob">Date of Birth</label><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="mobileNumber">Mobile Number</label><input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="employeeId">Employee ID</label><input type="text" id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleChange} required /></div>
                        <div className="form-group"><label htmlFor="division">Division / Service Area</label><input type="text" id="division" name="division" value={formData.division} onChange={handleChange} required /></div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register Agent</button>
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

export default RegisterAgentPage;