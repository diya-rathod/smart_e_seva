// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './RaiseComplaintPage.css';

// const RaiseComplaintPage = () => {
//     const navigate = useNavigate();
//     // We only need one state for all form data now
//     const [formData, setFormData] = useState({
//         category: '',
//         description: '',
//         landmark: '',
//         photo: null,
//         location: '',
//         meterNumber: '',
//         mobileNumber: '',
//     });

//     // Dummy function to simulate auto-fetching user data
//     useEffect(() => {
//         setFormData(prev => ({
//             ...prev,
//             meterNumber: 'MTR-54321',
//             mobileNumber: '+91 9876543210',
//             location: 'B-Wing, Shivalik Society, Ahmedabad'
//         }));
//     }, []);

//     const handleChange = (e) => {
//         const { name, value, type, files } = e.target;
//         if (type === 'file') {
//             setFormData(prev => ({ ...prev, [name]: files[0] }));
//         } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Show a confirmation dialog before submitting
//         const isConfirmed = window.confirm("Are you sure you want to submit this complaint?");
        
//         if (isConfirmed) {
//             console.log("Final Form Data:", formData);
//             // We will add the real axios.post() call here later
//             alert("Complaint Submitted Successfully (Mock)!");
//             navigate('/dashboard');
//         } else {
//             console.log("Complaint submission cancelled.");
//         }
//     };

//     return (
//         <div className="page-content-card">
//             <h1>Raise a New Complaint</h1>
            
//             <form onSubmit={handleSubmit} className="single-step-form">
//                 {/* --- Category Section --- */}
//                 <div className="form-section">
//                     <h2>Select a Category</h2>
//                     <div className="category-options">
//                         <label>
//                             <input type="radio" name="category" value="Street Light Issue" onChange={handleChange} />
//                             <span className="custom-radio"></span>Street Light Issue
//                         </label>
//                         <label>
//                             <input type="radio" name="category" value="Short Circuit Issue" onChange={handleChange} />
//                             <span className="custom-radio"></span>Short Circuit Issue
//                         </label>
//                         <label>
//                             <input type="radio" name="category" value="Light Pole Falling" onChange={handleChange} />
//                             <span className="custom-radio"></span>Light Pole Falling
//                         </label>
//                         <label>
//                             <input type="radio" name="category" value="Wire Cut Issue" onChange={handleChange} />
//                             <span className="custom-radio"></span>Wire Cut Issue
//                         </label>
//                     </div>
//                 </div>

//                 {/* --- Details Section --- */}
//                 <div className="form-section">
//                     <h2>Provide Details</h2>
//                     <div className="form-group">
//                         <label htmlFor="description">Describe your issue</label>
//                         <textarea name="description" id="description" rows="5" placeholder="e.g., The main wire connecting to the pole has snapped." value={formData.description} onChange={handleChange} required></textarea>
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="landmark">Nearby Landmark (Optional)</label>
//                         <input type="text" name="landmark" id="landmark" placeholder="e.g., Opposite Domino's Pizza" value={formData.landmark} onChange={handleChange} />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="photo">Upload Photo (Optional)</label>
//                         <input type="file" name="photo" id="photo" accept="image/*" onChange={handleChange} />
//                     </div>
//                 </div>

//                 {/* --- Location Section --- */}
//                 <div className="form-section">
//                     <h2>Confirm Details</h2>
//                     <div className="form-group">
//                         <label>Meter Number (Auto-fetched)</label>
//                         <input type="text" value={formData.meterNumber} readOnly />
//                     </div>
//                     <div className="form-group">
//                         <label>Mobile Number (Auto-fetched)</label>
//                         <input type="text" value={formData.mobileNumber} readOnly />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="location">Complaint Location</label>
//                         <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required />
//                     </div>
//                 </div>

//                 <button type="submit" className="submit-btn" disabled={!formData.category || !formData.description}>Submit Complaint</button>
//             </form>
//         </div>
//     );
// };

// export default RaiseComplaintPage;




import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './RaiseComplaintPage.css';
import Modal from '../../components/ui/Modal';

const RaiseComplaintPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ 
        category: '',
        description: '',
        landmark: '',
        photo: null,
        location: '',
        meterNumber: '',
        mobileNumber: '',
     });
    
    // State for the confirmation modal
    const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
    // State for the success modal
    const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

    useEffect(() => { 

        setFormData(prev => ({
            ...prev,
            meterNumber: 'MTR-54321',
            mobileNumber: '+91 9876543210',
            location: 'B-Wing, Shivalik Society, Ahmedabad'
        }));
     }, []);

    const handleChange = (e) => { 
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
     };

    // This will now open the CONFIRMATION modal
    const handleSubmit = (e) => {
        e.preventDefault();
        setConfirmModalOpen(true);
    };

    // This runs when user clicks 'Confirm' on the first modal
    const handleConfirmSubmit = async () => {
        setConfirmModalOpen(false); // Close confirmation modal
        console.log("Final Form Data:", formData);
        
        // --- This now opens the SUCCESS modal ---
        // In the future, the API call will go here.
        setSuccessModalOpen(true); 
    };

    // This runs when user clicks 'OK' on the success modal
    const handleSuccessModalClose = () => {
        setSuccessModalOpen(false); // Close success modal
        navigate('/dashboard'); // Navigate to dashboard
    };

    return (
        <div className="page-content-card">
            <h1>Raise a New Complaint</h1>
            
            <form onSubmit={handleSubmit} className="single-step-form">
                {/* --- Category Section --- */}
                 <div className="form-section">
                     <h2>Select a Category</h2>
                     <div className="category-options">
                         <label>
                             <input type="radio" name="category" value="Street Light Issue" onChange={handleChange} />
                             <span className="custom-radio"></span>Street Light Issue
                         </label>
                         <label>
                             <input type="radio" name="category" value="Short Circuit Issue" onChange={handleChange} />
                             <span className="custom-radio"></span>Short Circuit Issue
                         </label>
                         <label>
                             <input type="radio" name="category" value="Light Pole Falling" onChange={handleChange} />
                             <span className="custom-radio"></span>Light Pole Falling
                         </label>
                         <label>
                             <input type="radio" name="category" value="Wire Cut Issue" onChange={handleChange} />
                             <span className="custom-radio"></span>Wire Cut Issue
                         </label>
                     </div>
                 </div>

                 {/* --- Details Section --- */}
                 <div className="form-section">
                     <h2>Provide Details</h2>
                     <div className="form-group">
                         <label htmlFor="description">Describe your issue</label>
                         <textarea name="description" id="description" rows="5" placeholder="e.g., The main wire connecting to the pole has snapped." value={formData.description} onChange={handleChange} required></textarea>
                     </div>
                     <div className="form-group">
                         <label htmlFor="landmark">Nearby Landmark (Optional)</label>
                         <input type="text" name="landmark" id="landmark" placeholder="e.g., Opposite Domino's Pizza" value={formData.landmark} onChange={handleChange} />
                     </div>
                     <div className="form-group">
                         <label htmlFor="photo">Upload Photo (Optional)</label>
                         <input type="file" name="photo" id="photo" accept="image/*" onChange={handleChange} />
                     </div>
                 </div>

                 {/* --- Location Section --- */}
                 <div className="form-section">
                     <h2>Confirm Details</h2>
                     <div className="form-group">
                         <label>Meter Number (Auto-fetched)</label>
                         <input type="text" value={formData.meterNumber} readOnly />
                     </div>
                     <div className="form-group">
                         <label>Mobile Number (Auto-fetched)</label>
                         <input type="text" value={formData.mobileNumber} readOnly />
                     </div>
                     <div className="form-group">
                         <label htmlFor="location">Complaint Location</label>
                         <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required />
                     </div>
                 </div>

                 <button type="submit" className="submit-btn" disabled={!formData.category || !formData.description}>Submit Complaint</button>

            </form>
            
            {/* Modal 1: Confirmation */}
            <Modal 
                isOpen={isConfirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmSubmit}
                title="Confirm Submission"
            >
                <p>Are you sure you want to submit this complaint?</p>
            </Modal>

            {/* Modal 2: Success Message */}
            <Modal 
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose} // Close and navigate
                onConfirm={handleSuccessModalClose} // Close and navigate
                title="Success!"
                confirmText="OK" // Change button text
                hideCancelButton={true} // Hide the 'Cancel' button
            >
                <p>Your complaint has been submitted successfully!</p>
            </Modal>
        </div>
    );
};

export default RaiseComplaintPage;