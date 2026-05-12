import React from 'react';

function Toolbar({ filters, onChange, onAdd, total }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <div className="search-input">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, email, department…"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
          />
          {filters.search && (
            <button className="search-clear" onClick={() => update({ search: '' })} aria-label="Clear">×</button>
          )}
        </div>

        <select
          className="select"
          value={filters.role}
          onChange={(e) => update({ role: e.target.value })}
          aria-label="Filter by role"
        >
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="user">User</option>
        </select>

        <select
          className="select"
          value={filters.status}
          onChange={(e) => update({ status: e.target.value })}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="toolbar-right">
        <span className="muted small">{total} result{total === 1 ? '' : 's'}</span>
        <button className="btn btn-primary" onClick={onAdd}>
          <span aria-hidden>＋</span> Add user
        </button>
      </div>
    </div>
  );
}

export default Toolbar;
