import React from 'react';

const Card = ({ label, value, tone, icon }) => (
  <div className={`stat-card tone-${tone}`}>
    <div className="stat-icon" aria-hidden>{icon}</div>
    <div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value ?? '—'}</div>
    </div>
  </div>
);

function StatsCards({ stats }) {
  const roles = stats?.roles || {};
  return (
    <div className="stats-grid">
      <Card label="Total users" value={stats?.total} tone="primary" icon="👥" />
      <Card label="Active" value={stats?.active} tone="success" icon="✔" />
      <Card label="Inactive" value={stats?.inactive} tone="warning" icon="⏸" />
      <Card label="Admins" value={roles.admin} tone="info" icon="⚙" />
    </div>
  );
}

export default StatsCards;
