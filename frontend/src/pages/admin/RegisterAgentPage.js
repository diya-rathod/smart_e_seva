// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import AuthContext from '../../context/AuthContext';
// import Modal from '../../components/ui/Modal'; // Import the Modal component
// import './RegisterCitizenPage.css'; // We can reuse the same CSS
// import MapWidget from '../../components/MapWidget';


// const INITIAL_CENTER_LAT = 23.0225;
// const INITIAL_CENTER_LNG = 72.5714;

// const RegisterAgentPage = () => {
//     const navigate = useNavigate();
//     const { auth } = useContext(AuthContext);


//     const [formData, setFormData] = useState({
//         name: '',
//         email: '',
//         password: '',
//         dob: '',
//         mobileNumber: '',
//         employeeId: '',
//         status: 'Active',        
//         division: '',
//         latitude: INITIAL_CENTER_LAT, 
//         longitude: INITIAL_CENTER_LNG,
//         availabilityStatus: 'AVAILABLE' 
//     });
//     const [confirmPassword, setConfirmPassword] = useState('');
    
//     // State to manage the modal
//     const [modalState, setModalState] = useState({ 
//         isOpen: false, 
//         title: '', 
//         message: '', 
//         isSuccess: false 
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (formData.password !== confirmPassword) {
//             setModalState({ isOpen: true, title: 'Error!', message: 'Passwords do not match!', isSuccess: false });
//             return;
//         }

//         try {
//             const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
//             await axios.post('https://smart-eseva-backend.onrender.com/api/v1/admin/register-agent', formData, config);
            
//             // On success, open the success modal
//             setModalState({ isOpen: true, title: 'Success!', message: 'Agent registered successfully!', isSuccess: true });

//         } catch (error) {
//             const errorMessage = error.response?.data || "Registration failed. Please try again.";
//             // On error, open the error modal
//             setModalState({ isOpen: true, title: 'Registration Failed!', message: errorMessage, isSuccess: false });
//         }
//     };
    
//     const handleModalClose = () => { 
//         const wasSuccess = modalState.isSuccess;
//         setModalState({ isOpen: false, title: '', message: '', isSuccess: false });
//         if (wasSuccess) {
//             navigate('/admin/dashboard');
//         }
//     };

//     const handleMapClick = (lat, lng) => {
//     setFormData(prev => ({
//         ...prev,
//         latitude: lat,
//         longitude: lng,
//     }));
// };

//     return (
//         <div>
//             <h1>Register a New Agent</h1>
//             <div className="page-content-card">
//                 <form onSubmit={handleSubmit} className="register-citizen-form">
//                     <input type="hidden" name="latitude" value={formData.latitude} />
//                     <input type="hidden" name="longitude" value={formData.longitude} />

//                     <div className="form-grid">
//                         {/* Your form fields for the agent go here... */}
//                         <div className="form-group"><label htmlFor="name">Full Name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="email">Email Address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="password">Password</label><input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="confirmPassword">Confirm Password</label><input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
//                         <div className="form-group"><label htmlFor="dob">Date of Birth</label><input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="mobileNumber">Mobile Number</label><input type="text" id="mobileNumber" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="employeeId">Employee ID</label><input type="text" id="employeeId" name="employeeId" value={formData.employeeId} onChange={handleChange} required /></div>
//                         <div className="form-group"><label htmlFor="division">Division / Service Area</label><input type="text" id="division" name="division" value={formData.division} onChange={handleChange} required /></div>
//                     </div>
//                     <div className="form-group" style={{ height: '400px', margin: '20px 0' }}>
//                         <label>Agent Service Location (Click on Map)</label>
//                     <MapWidget 
//                         onLocationSelect={handleMapClick} 
//                         initialCenter={[23.0225, 72.5714]} // Default center, jaise Ahmedabad
//                         isMarkerMovable={true} // Marker ko move karne ki permission
//                     />
//                     {formData.latitude && (
//                         <p style={{ marginTop: '10px' }}>
//                             Selected Coords: {parseFloat(formData.latitude).toFixed(4)}
//                             {parseFloat(formData.longitude).toFixed(4)}
//                         </p>
//                     )}
//                     </div>
//                     <button type="submit" className="btn btn-primary">Register Agent</button>
//                 </form>

//                 {/* The Modal for showing success or error messages */}
//                 <Modal 
//                     isOpen={modalState.isOpen} 
//                     onClose={handleModalClose} 
//                     onConfirm={handleModalClose} 
//                     title={modalState.title} 
//                     confirmText="OK" 
//                     hideCancelButton={true}
//                 >
//                     <p>{modalState.message}</p>
//                 </Modal>
//             </div>
//         </div>
//     );
// };

// export default RegisterAgentPage;






//frontend/src/pages/admin/RegisterAgentPage.js

import React, { useState, useContext, useCallback, useEffect } from 'react'; 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal'; 
import './RegisterAgentPage.css'; 
import MapWidget from '../../components/MapWidget'; 


// Reverse Geocoding Utility Function (Component ke bahar rakha hai, taaki har render par recreate na ho)
const getReverseGeocode = async (lat, lon) => {
    try {
        // Nominatim API use karein
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
        const data = await response.json();

        if (data && data.display_name) {
            return data.display_name;
        }
        return `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} (Address not found)`;
    } catch (error) {
        console.error("Reverse Geocoding Failed:", error);
        return `Coordinates: ${lat.toFixed(4)}, ${lon.toFixed(4)} (Geocoding error)`;
    }
};


const INITIAL_CENTER_LAT = 23.0225;
const INITIAL_CENTER_LNG = 72.5714;

const RegisterAgentPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        dob: '',
        mobileNumber: '',
        employeeId: '',
        status: 'Active',
        division: '',
        latitude: INITIAL_CENTER_LAT, 
        longitude: INITIAL_CENTER_LNG,
        availabilityStatus: 'AVAILABLE' 
    });
    
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    // NEW STATE: Human-readable address display karne ke liye
    const [agentAddress, setAgentAddress] = useState(''); 
    
    const [modalState, setModalState] = useState({ 
        isOpen: false, 
        title: '', 
        message: '', 
        isSuccess: false 
    });

    // Component mount hone par initial address load karein
    useEffect(() => {
        const loadInitialAddress = async () => {
            const address = await getReverseGeocode(formData.latitude, formData.longitude);
            setAgentAddress(address);
        };
        // Dependency array empty rakhte hain taaki sirf pehli baar load ho
        loadInitialAddress();
    
    }, []); 

    const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // handleMapClick function ko useCallback se wrap karein
    const handleMapClick = useCallback(async (lat, lng) => {
        // 1. Coordinates ko form data mein save karein
        setFormData(prev => ({
            ...prev,
            latitude: Number(lat),
            longitude: Number(lng),
        }));
        
        // 2. Reverse Geocode karke human-readable address fetch karein
        const address = await getReverseGeocode(lat, lng);
        setAgentAddress(address); // Address state ko update karein
    }, []); 

    const handleSubmit = async (e) => {
    e.preventDefault();
        setLoading(true);

    if (formData.password !== confirmPassword) {
    setModalState({ isOpen: true, title: 'Error!', message: 'Passwords do not match!', isSuccess: false });
            setLoading(false);
    return;
    }
        
        // Final check
        if (!formData.latitude || !formData.longitude) {
            setModalState({ isOpen: true, title: 'Error!', message: 'Please select agent location on the map.', isSuccess: false });
            setLoading(false);
            return;
        }

    try {
        const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
        await axios.post('https://smart-eseva-backend.onrender.com/api/v1/admin/register-agent', formData, config);

        setModalState({ isOpen: true, title: 'Success!', message: 'Agent registered successfully!', isSuccess: true });

    } catch (error) {
        const errorMessage = error.response?.data || "Registration failed. Please try again.";
        setModalState({ isOpen: true, title: 'Registration Failed!', message: errorMessage, isSuccess: false });
    }
        setLoading(false);
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
    {/* Hidden fields for coordinates - FINAL APPROACH */}
    <input type="hidden" name="latitude" value={formData.latitude} />
    <input type="hidden" name="longitude" value={formData.longitude} />

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

    {/* --- MAP WIDGET AND ADDRESS DISPLAY --- */}
    <div className="map-container-wrapper" style={{ height: '400px', margin: '20px 0' }}>
        <label>Agent Service Location (Click/Drag on Map)</label>
        <MapWidget 
        onLocationSelect={handleMapClick} 
        initialCenter={[INITIAL_CENTER_LAT, INITIAL_CENTER_LNG]} 
        isMarkerMovable={true} 
        />
    </div>
        {/* Address display karein */}
    <div className="address-display">
        <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
        **Selected Location:** {agentAddress || 'Loading address...'}
        </p>
        <p style={{ fontSize: '0.8em', color: '#888' }}>
        Coordinates: {parseFloat(formData.latitude).toFixed(4)}, {parseFloat(formData.longitude).toFixed(4)}
        </p>
    </div>

    <button type="submit" className="btn btn-primary" disabled={loading}>
    {loading ? 'Registering...' : 'Register Agent'}
    </button>
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