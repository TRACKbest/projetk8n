import React, { useEffect, useState } from 'react';
import Modal from './Modal';

const initial = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  role: 'user',
  status: 'active',
};

const validate = (values) => {
  const errors = {};
  if (!values.firstName || values.firstName.trim().length < 2) errors.firstName = 'At least 2 characters';
  if (!values.lastName || values.lastName.trim().length < 2) errors.lastName = 'At least 2 characters';
  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errors.email = 'Invalid email';
  return errors;
};

function UserFormModal({ user, onSave, onClose }) {
  const isEdit = Boolean(user);
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setValues(user ? { ...initial, ...user } : initial);
    setErrors({});
  }, [user]);

  const set = (k, v) => setValues((prev) => ({ ...prev, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    try {
      await onSave(values);
    } catch (_) {
      // error already shown via toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title={isEdit ? 'Edit user' : 'Add new user'}
      subtitle={isEdit ? 'Update user information' : 'Fill in the details below to create a new user.'}
      onClose={onClose}
      width={560}
    >
      <form onSubmit={submit} className="form">
        <div className="form-row">
          <div className="field">
            <label>First name *</label>
            <input
              className={`input ${errors.firstName ? 'has-error' : ''}`}
              value={values.firstName}
              onChange={(e) => set('firstName', e.target.value)}
              autoFocus
            />
            {errors.firstName && <div className="field-error">{errors.firstName}</div>}
          </div>
          <div className="field">
            <label>Last name *</label>
            <input
              className={`input ${errors.lastName ? 'has-error' : ''}`}
              value={values.lastName}
              onChange={(e) => set('lastName', e.target.value)}
            />
            {errors.lastName && <div className="field-error">{errors.lastName}</div>}
          </div>
        </div>

        <div className="field">
          <label>Email *</label>
          <input
            type="email"
            className={`input ${errors.email ? 'has-error' : ''}`}
            value={values.email}
            onChange={(e) => set('email', e.target.value)}
          />
          {errors.email && <div className="field-error">{errors.email}</div>}
        </div>

        <div className="form-row">
          <div className="field">
            <label>Phone</label>
            <input className="input" value={values.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
          <div className="field">
            <label>Department</label>
            <input className="input" value={values.department} onChange={(e) => set('department', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Role</label>
            <select className="select" value={values.role} onChange={(e) => set('role', e.target.value)}>
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="field">
            <label>Status</label>
            <select className="select" value={values.status} onChange={(e) => set('status', e.target.value)}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={submitting}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving…' : (isEdit ? 'Save changes' : 'Create user')}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserFormModal;
