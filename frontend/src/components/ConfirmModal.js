import React from 'react';
import Modal from './Modal';

function ConfirmModal({ title, message, confirmLabel = 'Confirm', danger = false, onConfirm, onClose }) {
  return (
    <Modal title={title} onClose={onClose} width={420}>
      <p style={{ marginTop: 0 }}>{message}</p>
      <div className="modal-footer">
        <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
        <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export default ConfirmModal;
