import React from 'react';

const initials = (u) => `${(u.firstName || '?')[0]}${(u.lastName || '')[0] || ''}`.toUpperCase();

const roleBadge = {
  admin:   { label: 'Admin',   cls: 'badge badge-danger' },
  manager: { label: 'Manager', cls: 'badge badge-info' },
  user:    { label: 'User',    cls: 'badge badge-neutral' },
};

const colorFromString = (s = '') => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 360;
  return `hsl(${h}, 65%, 55%)`;
};

function UserRow({ user, onEdit, onDelete }) {
  const role = roleBadge[user.role] || roleBadge.user;
  return (
    <tr>
      <td>
        <div className="user-cell">
          <div className="avatar" style={{ background: colorFromString(user.email || '') }}>
            {initials(user)}
          </div>
          <div>
            <div className="user-name">{user.firstName} {user.lastName}</div>
            <div className="muted small">{user.department || '—'}</div>
          </div>
        </div>
      </td>
      <td>{user.email}</td>
      <td>{user.phone || <span className="muted">—</span>}</td>
      <td><span className={role.cls}>{role.label}</span></td>
      <td>
        <span className={`badge ${user.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
          <span className="dot" /> {user.status}
        </span>
      </td>
      <td className="col-actions">
        <button className="icon-btn" title="Edit" onClick={() => onEdit(user)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 20h4l10-10-4-4L4 16v4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="icon-btn icon-btn-danger" title="Delete" onClick={() => onDelete(user)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13a2 2 0 002 2h6a2 2 0 002-2l1-13M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                  stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </td>
    </tr>
  );
}

function UserTable({ users, loading, onEdit, onDelete }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th className="col-actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="6" className="table-state"><div className="spinner" /> Loading…</td></tr>
          ) : users.length === 0 ? (
            <tr><td colSpan="6" className="table-state">
              <div className="empty">
                <div className="empty-icon">👤</div>
                <div className="empty-title">No users found</div>
                <div className="muted">Try adjusting your filters or add a new user.</div>
              </div>
            </td></tr>
          ) : (
            users.map((u) => (
              <UserRow key={u.id || u._id} user={u} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
