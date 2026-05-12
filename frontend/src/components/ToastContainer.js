import React from 'react';

const icon = {
  success: '✔',
  error: '✕',
  info: 'ℹ',
  warning: '⚠',
};

function ToastContainer({ toasts }) {
  return (
    <div className="toast-container" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="toast-icon">{icon[t.type] || 'ℹ'}</span>
          <span className="toast-msg">{t.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
