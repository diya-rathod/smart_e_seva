// Modal.js

import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  hideCancelButton = false,
  // --- YEH NAYA PROP ADD KIYA HAI ---
  hideConfirmButton = false 
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
          {/* Cancel button abhi bhi aese hi rahega */}
          {!hideCancelButton && (
            <button onClick={onClose} className="btn-secondary">{cancelText}</button>
          )}

          {/* --- CONFIRM BUTTON KO BHI AB CONDITIONALLY RENDER KARENGE --- */}
          {!hideConfirmButton && (
            <button onClick={onConfirm} className="btn-primary">{confirmText}</button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;