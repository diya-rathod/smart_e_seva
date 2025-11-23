// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// // import toast from 'react-hot-toast';
// import AuthContext from '../../context/AuthContext'; // AuthContext for getting the token
// import './RegisterCitizenPage.css'; // We will create this CSS file next

// const RegisterCitizenPage = () => {
//     const navigate = useNavigate();
//     const { auth } = useContext(AuthContext); // Get auth state from context
//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         dob: '',
//         mobileNumber: '',
//         meterNumber: '',
//         serviceAddress: '',
//         landmark: ''
//     });
//     const [confirmPassword, setConfirmPassword] = useState('');

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (formData.password !== confirmPassword) {
//             toast.error("Passwords do not match!");
//             return;
//         }

//         try {
//             // Prepare headers with the admin's auth token
//             const config = {
//                 headers: {
//                     'Authorization': `Bearer ${auth.token}`
//                 }
//             };

//             // Call the secure API endpoint
//             await axios.post('https://smart-eseva-backend.onrender.com/api/v1/admin/register-citizen', formData, config);
            
//             toast.success('Citizen registered successfully!');
//             navigate('/admin/dashboard'); // Redirect to admin dashboard on success

//         } catch (error) {
//             console.error('Registration failed:', error);
//             const errorMessage = error.response?.data || "Registration failed. Please try again.";
//             toast.error(errorMessage);
//         }
//     };

//     return (
//         <div>
//             <h1>Register a New Citizen</h1>
//             <div className="page-content-card">
//                 <form onSubmit={handleSubmit} className="register-citizen-form">
//                     <div className="form-grid">
//                         <div className="form-group">
//                             <label htmlFor="name">Full Name</label>
//                             <input type="text" id="name" name="name" onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="email">Email Address</label>
//                             <input type="email" id="email" name="email" onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="password">Password</label>
//                             <input type="password" id="password" name="password" onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="confirmPassword">Confirm Password</label>
//                             <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} required />
//                         </div>
//                          <div className="form-group">
//                             <label htmlFor="dob">Date of Birth</label>
//                             <input type="date" id="dob" name="dob" onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="mobileNumber">Mobile Number</label>
//                             <input type="text" id="mobileNumber" name="mobileNumber" onChange={handleChange} required />
//                         </div>
//                          <div className="form-group">
//                             <label htmlFor="meterNumber">Meter Number</label>
//                             <input type="text" id="meterNumber" name="meterNumber" onChange={handleChange} required />
//                         </div>
//                         <div className="form-group">
//                             <label htmlFor="landmark">Landmark (Optional)</label>
//                             <input type="text" id="landmark" name="landmark" onChange={handleChange} />
//                         </div>
//                         <div className="form-group form-span-2">
//                             <label htmlFor="serviceAddress">Service Address</label>
//                             <textarea id="serviceAddress" name="serviceAddress" rows="3" onChange={handleChange} required></textarea>
//                         </div>
//                     </div>
//                     <button type="submit" className="btn btn-primary">Register Citizen</button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default RegisterCitizenPage; 






import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import './RegisterCitizenPage.css';

const RegisterCitizenPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', dob: '',
        mobileNumber: '', meterNumber: '', serviceAddress: '', landmark: ''
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', isSuccess: false });

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
            if (!auth || !auth.token) {
                throw new Error("Admin not authenticated!");
            }
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.post('https://smart-eseva-backend.onrender.com/api/v1/admin/register-citizen', formData, config);
            setModalState({ isOpen: true, title: 'Success!', message: 'Citizen registered successfully!', isSuccess: true });
        } catch (error) {
            console.error('Registration failed:', error);
            const errorMessage = error.response?.data || "Registration failed. Please try again.";
            setModalState({ isOpen: true, title: 'Registration Failed!', message: errorMessage, isSuccess: false });
        }
    };
    
    // --- THIS IS THE CORRECTED FUNCTION ---
    const handleModalClose = () => { 
        const wasSuccess = modalState.isSuccess;
        // First, close the modal
        setModalState({ isOpen: false, title: '', message: '', isSuccess: false });
        
        // If the action was a success, then navigate
        if (wasSuccess) {
            navigate('/admin/dashboard');
        }
    };

    return (
        <div>
            <h1>Register a New Citizen</h1>
            <div className="page-content-card">
                <form onSubmit={handleSubmit} className="register-citizen-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input type="text" id="name" name="name" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="password" name="password" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input type="password" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dob">Date of Birth</label>
                            <input type="date" id="dob" name="dob" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="mobileNumber">Mobile Number</label>
                            <input type="text" id="mobileNumber" name="mobileNumber" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="meterNumber">Meter Number</label>
                            <input type="text" id="meterNumber" name="meterNumber" onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="landmark">Landmark (Optional)</label>
                            <input type="text" id="landmark" name="landmark" onChange={handleChange} />
                        </div>
                        <div className="form-group form-span-2">
                            <label htmlFor="serviceAddress">Service Address</label>
                            <textarea id="serviceAddress" name="serviceAddress" rows="3" onChange={handleChange} required></textarea>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register Citizen</button>
                </form>

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

export default RegisterCitizenPage;