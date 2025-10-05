import React from 'react';
import './Profile.css'; 
const Profile = () => {
  return (
    <div className="page-content-card">
      <h1>Profile & Settings</h1>

      {/* --- Personal Information Section --- */}
      <div className="profile-section">
        <h2>Personal Information</h2>
        <form>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input type="text" id="fullName" defaultValue="Diya Rathod" />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input type="email" id="email" defaultValue="diya.r@example.com" readOnly />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" defaultValue="+91 12345 67890" />
          </div>
          <button type="submit" className="btn">Save Changes</button>
        </form>
      </div>

      {/* --- Saved Addresses Section --- */}
      <div className="profile-section">
        <h2>Saved Addresses</h2>
        <form>
          <div className="form-group">
            <label htmlFor="homeAddress">Home Address</label>
            <input type="text" id="homeAddress" placeholder="Enter your home address" />
          </div>
          <div className="form-group">
            <label htmlFor="officeAddress">Office Address</label>
            <input type="text" id="officeAddress" placeholder="Enter your office address" />
          </div>
          <button type="submit" className="btn">Save Addresses</button>
        </form>
      </div>

      {/* --- Notification Preferences Section --- */}
      <div className="profile-section">
        <h2>Notification Preferences</h2>
        <div className="notification-item">
          <label htmlFor="emailNotif">Email Notifications</label>
          <label className="toggle-switch">
            <input type="checkbox" id="emailNotif" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <label htmlFor="smsNotif">SMS Notifications</label>
          <label className="toggle-switch">
            <input type="checkbox" id="smsNotif" />
            <span className="slider"></span>
          </label>
        </div>
        <div className="notification-item">
          <label htmlFor="pushNotif">Push Notifications</label>
          <label className="toggle-switch">
            <input type="checkbox" id="pushNotif" defaultChecked />
            <span className="slider"></span>
          </label>
        </div>
      </div>
      
      {/* --- Account Management Section --- */}
      <div className="profile-section">
        <h2>Account Management</h2>
        <button className="btn btn-danger">Deactivate Account</button>
      </div>
    </div>
  );
};

export default Profile;