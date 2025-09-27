import React, { useState } from 'react';
import './RaiseComplaint.css';

const RaiseComplaint = () => {
  // Your existing form logic (useState, handleChange, handleSubmit) remains the same
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    name: '',
    phone: ''
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevState => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted Data:", formData);
    alert("Complaint submitted successfully! Check the console for data.");
  };

  return (
    <main className="raise-complaint-page">
      {/* Hero Section */}
      <section className="raise-hero">
        <h1>Report a New Issue</h1>
        <p>Your report helps us improve our services. Please fill out the form below.</p>
      </section>

      {/* Form Section */}
      <section className="raise-form-section">
        <div className="form-card">
          <form className="complaint-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select id="category" required value={formData.category} onChange={handleChange}>
                  <option value="">-- Select a Category --</option>
                  <option value="electricity">Electricity</option>
                  <option value="water">Water</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" id="location" placeholder="e.g., Near City Hall" value={formData.location} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="photo">Upload Photo</label>
              <input type="file" id="photo" className="file-input" accept="image/*" />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea id="description" rows="5" placeholder="Describe the issue in detail..." required value={formData.description} onChange={handleChange}></textarea>
            </div>

            <hr />

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Your Name *</label>
                <input type="text" id="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input type="tel" id="phone" placeholder="Enter your phone number" required value={formData.phone} onChange={handleChange} />
              </div>
            </div>

            <button type="submit" className="submit-button">Submit Complaint</button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default RaiseComplaint;