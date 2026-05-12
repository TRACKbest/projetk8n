import React, { useEffect } from 'react';

function Modal({ title, subtitle, children, onClose, width = 480 }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" onMouseDown={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal" style={{ maxWidth: width }}>
        <div className="modal-header">
          <div>
            <h3>{title}</h3>
            {subtitle && <div className="muted small">{subtitle}</div>}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
