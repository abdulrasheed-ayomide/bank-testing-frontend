import React from 'react';

const ConfirmModal = ({ title, children, confirmLabel = 'Confirm', confirmVariant = 'primary', onConfirm, onCancel, loading }) => (
  <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
    <div className="modal">
      <div className="modal-header">
        <h3 id="confirm-modal-title" className="mb-0">{title}</h3>
      </div>
      <div>{children}</div>
      <div className="modal-footer">
        <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>Cancel</button>
        <button className={`btn btn-${confirmVariant}`} onClick={onConfirm} disabled={loading}>
          {loading ? <span className="spinner" /> : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
