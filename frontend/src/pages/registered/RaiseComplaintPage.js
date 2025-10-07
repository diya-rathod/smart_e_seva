// import React, { useState, useEffect, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';
// import Modal from '../../components/ui/Modal';
// import './RaiseComplaintPage.css';

// const RaiseComplaintPage = () => {
//     const navigate = useNavigate();
//     const { auth } = useContext(AuthContext);
//     const [formData, setFormData] = useState({
//         category: '',
//         description: '',
//         landmark: '',
//         photo: null,
//         location: '',
//         meterNumber: '',
//         mobileNumber: '',
//         // Nayi fields coordinates ke liye
//         latitude: null,
//         longitude: null,
//     });
//     const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', isSuccess: false });
//     const [isFetchingLocation, setIsFetchingLocation] = useState(true); // Location fetching ke liye loading state

//     useEffect(() => {
//         // --- NEW: Auto-fetch user details AND location ---
//         const fetchInitialData = async () => {
//             if (!auth || !auth.token) return;

//             // 1. Fetch User Details (Meter No., Mobile, etc.)
//             try {
//                 const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//                 const response = await axios.get('http://localhost:8080/api/v1/users/me', config);
//                 const user = response.data;
//                 setFormData(prev => ({
//                     ...prev,
//                     meterNumber: user.meterNumber || '',
//                     mobileNumber: user.mobileNumber || '',
//                     location: user.serviceAddress || ''
//                 }));
//             } catch (error) {
//                 console.error("Failed to fetch user details:", error);
//             }

//             // 2. Fetch Geolocation
//             if ("geolocation" in navigator) {
//                 navigator.geolocation.getCurrentPosition(
//                     (position) => {
//                         setFormData(prev => ({
//                             ...prev,
//                             latitude: position.coords.latitude,
//                             longitude: position.coords.longitude
//                         }));
//                         setIsFetchingLocation(false);
//                     },
//                     (error) => {
//                         console.error("Error getting location:", error);
//                         alert("Could not get your location. Please enter your address manually.");
//                         setIsFetchingLocation(false);
//                     }
//                 );
//             } else {
//                 alert("Geolocation is not supported by your browser.");
//                 setIsFetchingLocation(false);
//             }
//         };

//         fetchInitialData();
//     }, [auth]);

//         const handleChange = (e) => { 
//         const { name, value, type, files } = e.target;
//             if (type === 'file') {
//             setFormData(prev => ({ ...prev, [name]: files[0] }));
//             } else {
//             setFormData(prev => ({ ...prev, [name]: value }));
//             }
//         };

//         const handleSubmit = (e) => {
//             e.preventDefault();
//             setConfirmModalOpen(true);
//         };
    
//         const handleConfirmSubmit = async () => {
//             setConfirmModalOpen(false); // Close confirmation modal
//             console.log("Final Form Data:", formData);
            
//             // --- This now opens the SUCCESS modal ---
//             // In the future, the API call will go here.
//             setSuccessModalOpen(true); 
//         };

//     // This runs when user clicks 'OK' on the success modal
    
//         const handleModalClose = () => {
//             setSuccessModalOpen(false); // Close success modal
//             navigate('/dashboard'); // Navigate to dashboard
//         };

//     return (
//         <div className="page-content-card">
//             <h1>Raise a New Complaint</h1>
            
//             <form onSubmit={handleSubmit} className="single-step-form">
//                                  {/* --- Category Section --- */}
//                  <div className="form-section">
//                        <h2>Select a Category</h2>
//                        <div className="category-options">
//                            <label>
//                                <input type="radio" name="category" value="Street Light Issue" onChange={handleChange} />
//                                <span className="custom-radio"></span>Street Light Issue
//                            </label>
//                            <label>
//                                <input type="radio" name="category" value="Short Circuit Issue" onChange={handleChange} />
//                                <span className="custom-radio"></span>Short Circuit Issue
//                            </label>
//                            <label>
//                                <input type="radio" name="category" value="Light Pole Falling" onChange={handleChange} />
//                                <span className="custom-radio"></span>Light Pole Falling
//                            </label>
//                            <label>
//                                <input type="radio" name="category" value="Wire Cut Issue" onChange={handleChange} />
//                                <span className="custom-radio"></span>Wire Cut Issue
//                            </label>
//                        </div>
//                    </div>

//                  {/* --- Details Section --- */}
//                  <div className="form-section">
//                        <h2>Provide Details</h2>
//                        <div className="form-group">
//                            <label htmlFor="description">Describe your issue</label>
//                            <textarea name="description" id="description" rows="5" placeholder="e.g., The main wire connecting to the pole has snapped." value={formData.description} onChange={handleChange} required></textarea>
//                        </div>
//                        <div className="form-group">
//                            <label htmlFor="landmark">Nearby Landmark (Optional)</label>
//                            <input type="text" name="landmark" id="landmark" placeholder="e.g., Opposite Domino's Pizza" value={formData.landmark} onChange={handleChange} />
//                        </div>
//                        <div className="form-group">
//                            <label htmlFor="photo">Upload Photo (Optional)</label>
//                            <input type="file" name="photo" id="photo" accept="image/*" onChange={handleChange} />
//                        </div>
//                    </div>

//                 {/* --- Location Section (Updated) --- */}
//                 <div className="form-section">
//                     <h2>Confirm Details & Location</h2>
//                     {/* ... (Meter Number and Mobile Number fields) ... */}
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
//                         {isFetchingLocation ? (
//                             <p>Fetching your location...</p>
//                         ) : (
//                             <input 
//                                 type="text" 
//                                 name="location" 
//                                 id="location" 
//                                 value={formData.location} 
//                                 onChange={handleChange} 
//                                 required 
//                             />
//                         )}
//                         <p style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '5px' }}>
//                             Your current coordinates: 
//                             Lat: {formData.latitude || 'N/A'}, 
//                             Lng: {formData.longitude || 'N/A'}
//                         </p>
//                     </div>
//                 </div>

//                 <button type="submit" className="submit-btn" disabled={!formData.category || !formData.description}>Submit Complaint</button>
//             </form>

//             <Modal
//                  isOpen={modalState.isOpen}
//                  onClose={handleModalClose}
//                  onConfirm={modalState.isConfirmation ? handleConfirmSubmit : handleModalClose}
//                  title={modalState.title}
//                  confirmText={modalState.isConfirmation ? "Confirm" : "OK"}
//                  hideCancelButton={!modalState.isConfirmation}
//             >
//                  <p>{modalState.message}</p>
//              </Modal>
//         </div>
//     );
// };

// export default RaiseComplaintPage;






import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';
import './RaiseComplaintPage.css';

const RaiseComplaintPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        category: '',
        description: '',
        landmark: '',
        photo: null,
        location: '',
        meterNumber: '',
        mobileNumber: '',
        latitude: null,
        longitude: null,
    });
    const [modalState, setModalState] = useState({ isOpen: false, title: '', message: '', isSuccess: false });
    const [isFetchingLocation, setIsFetchingLocation] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!auth || !auth.token) {
                setIsFetchingLocation(false);
                return;
            }

            // 1. Fetch User Details (as a fallback)
            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get('http://localhost:8080/api/v1/users/me', config);
                const user = response.data;
                setFormData(prev => ({
                    ...prev,
                    meterNumber: user.meterNumber || '',
                    mobileNumber: user.mobileNumber || '',
                    location: user.serviceAddress || ''
                }));
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }

            // 2. Fetch Geolocation and then Reverse Geocode
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        
                        // --- NEW: REVERSE GEOCODING LOGIC ---
                        try {
                            const osmResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const readableAddress = osmResponse.data.display_name || 'Could not fetch address';
                            
                            setFormData(prev => ({
                                ...prev,
                                latitude: latitude,
                                longitude: longitude,
                                location: readableAddress // Update location with live address
                            }));
                        } catch (geoError) {
                            console.error("Reverse geocoding failed:", geoError);
                            // If reverse geocoding fails, just save the coordinates
                            setFormData(prev => ({ ...prev, latitude, longitude }));
                        } finally {
                            setIsFetchingLocation(false);
                        }
                    },
                    (error) => {
                        console.error("Error getting location:", error);
                        alert("Could not get your location. Please enter your address manually.");
                        setIsFetchingLocation(false);
                    }
                );
            } else {
                alert("Geolocation is not supported by your browser.");
                setIsFetchingLocation(false);
            }
        };

        fetchInitialData();
    }, [auth]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // This should open the confirmation modal
        setModalState({ 
            isOpen: true, 
            title: 'Confirm Submission', 
            message: 'Are you sure you want to submit this complaint?', 
            isSuccess: false,
            isConfirmation: true
        });
    };

    const handleConfirmSubmit = async () => {
        setModalState({ isOpen: false }); // Close confirmation modal
        try {
            if (!auth || !auth.token) throw new Error("You are not logged in!");

            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.post('http://localhost:8080/api/v1/complaints', formData, config);
            
            setModalState({ isOpen: true, title: 'Success!', message: 'Your complaint has been submitted successfully!', isSuccess: true });

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to submit complaint. Please try again.";
            setModalState({ isOpen: true, title: 'Submission Failed!', message: errorMessage, isSuccess: false });
        }
    };

    const handleModalClose = () => {
        const wasSuccess = modalState.isSuccess;
        setModalState({ isOpen: false });
        if (wasSuccess) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="page-content-card">
            <h1>Raise a New Complaint</h1>
            
            <form onSubmit={handleSubmit} className="single-step-form">
                {/* ... (Category and other sections) ... */}

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
                
                <div className="form-section">
                    <h2>Confirm Details & Location</h2>
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
                        {isFetchingLocation ? (
                            <p>Fetching your live location...</p>
                        ) : (
                            <textarea 
                                name="location" 
                                id="location" 
                                rows="3"
                                value={formData.location} 
                                onChange={handleChange} 
                                required 
                            />
                        )}
                        <p className="coords-display">
                            Coordinates: Lat: {formData.latitude?.toFixed(4) || '...'}, Lng: {formData.longitude?.toFixed(4) || '...'}
                        </p>
                    </div>
                </div>

                <button type="submit" className="submit-btn" disabled={!formData.category || !formData.description}>Submit Complaint</button>
            </form>

            <Modal
                isOpen={modalState.isOpen}
                onClose={handleModalClose}
                onConfirm={modalState.isConfirmation ? handleConfirmSubmit : handleModalClose}
                title={modalState.title}
                confirmText={modalState.isConfirmation ? "Confirm" : "OK"}
                hideCancelButton={!modalState.isConfirmation}
            >
                <p>{modalState.message}</p>
            </Modal>
        </div>
    );
};

export default RaiseComplaintPage;