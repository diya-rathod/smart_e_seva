import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children,
  // --- NEW PROPS ---
  confirmText = "Confirm", // Default text for confirm button
  cancelText = "Cancel",   // Default text for cancel button
  hideCancelButton = false // Prop to hide the cancel button
}) => {
  if (!isOpen) {
    return null;
  }

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{title}</h3>
          <button onClick={onClose} className="modal-close-btn">&times;</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        <div className="modal-footer">
          {/* Cancel button ko conditionally render karein */}
          {!hideCancelButton && (
            <button onClick={onClose} className="btn-secondary">{cancelText}</button>
          )}
          <button onClick={onConfirm} className="btn-primary">{confirmText}</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;