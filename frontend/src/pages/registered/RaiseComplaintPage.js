import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, UploadCloud } from 'lucide-react';
import AuthContext from '../../context/AuthContext';
import Modal from '../../components/ui/Modal';

const CATEGORY_OPTIONS = [
    "Street Light Issue",
    "Short Circuit Issue",
    "Light Pole Falling",
    "Wire Cut Issue",
    "Transformer Damage",
    "Power Outage",
];

const RaiseComplaintPage = () => {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const fileInputRef = useRef(null);
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
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!auth || !auth.token) {
                setIsFetchingLocation(false);
                return;
            }

            try {
                const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
                const response = await axios.get('https://smart-eseva-backend.onrender.com/api/v1/users/me', config);
                const user = response.data;
                setFormData(prev => ({
                    ...prev,
                    meterNumber: user.meterNumber || '',
                    mobileNumber: user.mobileNumber || '',
                    location: user.serviceAddress || '',
                }));
            } catch (error) {
                console.error("Failed to fetch user details:", error);
            }

            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;
                        try {
                            const osmResponse = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                            const readableAddress = osmResponse.data.display_name || 'Could not fetch address';
                            setFormData(prev => ({
                                ...prev,
                                latitude,
                                longitude,
                                location: readableAddress,
                            }));
                        } catch (geoError) {
                            console.error("Reverse geocoding failed:", geoError);
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

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setModalState({
            isOpen: true,
            title: 'Confirm Submission',
            message: 'Are you sure you want to submit this complaint?',
            isSuccess: false,
            isConfirmation: true,
        });
    };

    const handleConfirmSubmit = async () => {
        setModalState({ isOpen: false });
        try {
            if (!auth || !auth.token) throw new Error("You are not logged in!");
            const config = { headers: { 'Authorization': `Bearer ${auth.token}` } };
            await axios.post('https://smart-eseva-backend.onrender.com/api/v1/complaints', formData, config);
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

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleDragEvents = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            setDragActive(true);
        } else if (event.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDragActive(false);
        const file = event.dataTransfer?.files?.[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                photo: file,
            }));
        }
    };

    const canSubmit = Boolean(formData.category && formData.description && formData.location);

    return (
        <div className="min-h-screen w-full bg-slate-50 py-10 dark:bg-slate-950">
            <div className="w-full bg-white/80 dark:bg-white/5 backdrop-blur rounded-2xl shadow-[0_12px_50px_rgba(15,23,42,0.15)] p-8 space-y-8">
                <header className="space-y-2">
                    <p className="text-sm font-medium tracking-tight uppercase text-gray-500 dark:text-gray-400">Raise a complaint</p>
                    <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">Tell us what you need fixed</h1>
                    <p className="text-base leading-[1.5] text-slate-600 dark:text-slate-300">
                        Provide accurate details so we can route your request to the right team quickly. Every option has been tuned for clarity.
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <section className="space-y-4">
                        <p className="text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-200">Select a category</p>
                        <div className="flex flex-wrap gap-3">
                            {CATEGORY_OPTIONS.map((category) => {
                                const isSelected = formData.category === category;
                                const baseStyles = "rounded-full px-4 py-2 border text-sm font-medium transition duration-200";
                                const selectedStyles = "bg-emerald-600 text-white border-emerald-600 shadow-sm scale-[1.02]";
                                const unselectedStyles = "border-gray-300 text-gray-700 dark:text-gray-300 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-500/10";
                                return (
                                    <button
                                        key={category}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setFormData(prev => ({ ...prev, category }))}
                                        className={`${baseStyles} ${isSelected ? selectedStyles : unselectedStyles}`}
                                    >
                                        {category}
                                    </button>
                                );
                            })}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                            Pick the option that best describes the issue — you can refine it in the description.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <p className="text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-200">Describe the issue</p>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    What happened?
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., The main wire connecting the pole to the grid snapped overnight and is lying on the road."
                                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm tracking-normal leading-[1.4] text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-shadow duration-200 min-h-[130px]"
                                />
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    The more specific you are, the faster we can prioritize the right crew.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="landmark" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nearby landmark (optional)
                                </label>
                                <input
                                    id="landmark"
                                    name="landmark"
                                    value={formData.landmark}
                                    onChange={handleChange}
                                    placeholder="Opposite Domino's Pizza, Civic Center"
                                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm tracking-normal leading-[1.4] text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-shadow duration-200"
                                />
                                <p className="text-xs text-slate-500 dark:text-gray-400">
                                    Helps technicians locate the spot faster even if the coordinates are off.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <p className="text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-200">Upload supporting media</p>
                        <div
                            className={`relative cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition ${dragActive ? "border-emerald-500 bg-emerald-500/10" : "border-gray-300 bg-white/80 dark:border-white/10 dark:bg-white/5"}`}
                            onClick={handleFileClick}
                            onDragEnter={handleDragEvents}
                            onDragOver={handleDragEvents}
                            onDragLeave={handleDragEvents}
                            onDrop={handleDrop}
                        >
                            <UploadCloud className="mx-auto h-8 w-8 text-emerald-500" />
                            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300">Drag & drop a photo, or click to browse</p>
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">JPEG, PNG, max 5MB.</p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                name="photo"
                                className="absolute inset-0 h-full w-full opacity-0"
                                onChange={handleChange}
                            />
                        </div>
                        {formData.photo && (
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Attached file: <span className="font-medium">{formData.photo.name}</span>
                            </p>
                        )}
                    </section>

                    <section className="space-y-4">
                        <p className="text-lg font-semibold tracking-tight text-gray-700 dark:text-gray-200">Confirm your details</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Meter number</label>
                                <input
                                    type="text"
                                    name="meterNumber"
                                    value={formData.meterNumber}
                                    readOnly
                                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm tracking-normal leading-[1.4] text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Mobile number</label>
                                <input
                                    type="text"
                                    name="mobileNumber"
                                    value={formData.mobileNumber}
                                    readOnly
                                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm tracking-normal leading-[1.4] text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="location" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Complaint location
                            </label>
                            {isFetchingLocation ? (
                                <p className="text-sm text-gray-500 dark:text-gray-400">Fetching your live location…</p>
                            ) : (
                                <textarea
                                    id="location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                    placeholder="e.g., Sector 14, near the municipal complex"
                                    className="w-full rounded-xl border border-gray-300 bg-white/80 px-4 py-3 text-sm tracking-normal leading-[1.4] text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none transition-shadow duration-200 min-h-[130px]"
                                />
                            )}
                            <p className="text-xs text-slate-500 dark:text-gray-400 mt-1">
                                Coordinates: Lat {formData.latitude?.toFixed(4) || '—'}, Lng {formData.longitude?.toFixed(4) || '—'}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200/70 bg-slate-900/5 px-4 py-4 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-gray-200">
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                                <MapPin className="h-4 w-4" />
                                <span>Live coordinates</span>
                            </div>
                            <p className="mt-2">Latitude: {formData.latitude?.toFixed(5) || 'Not available yet'}</p>
                            <p>Longitude: {formData.longitude?.toFixed(5) || 'Not available yet'}</p>
                            <p className="mt-2 text-xs text-slate-500 dark:text-gray-400">
                                We pull your device location; refresh your browser if it looks stale.
                            </p>
                        </div>
                    </section>

                    <div className="flex flex-col items-start gap-3">
                        <button
                            type="submit"
                            disabled={!canSubmit}
                            className={`w-full rounded-xl px-6 py-3 text-base font-medium text-white transition duration-200 ${canSubmit ? "bg-emerald-600 hover:shadow-lg hover:scale-[1.02]" : "bg-emerald-400/60 cursor-not-allowed"}`}
                        >
                            Submit complaint
                        </button>
                        <p className="text-xs text-slate-500 dark:text-gray-400">
                            You can edit your entries before submission. After submission, our support team will respond via SMS.
                        </p>
                    </div>
                </form>
            </div>

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

