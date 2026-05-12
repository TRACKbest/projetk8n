import React from 'react';

function Header({ onAdd }) {
  return (
    <header className="app-header">
      <div className="container header-inner">
        <div className="brand">
          <div className="logo-mark" aria-hidden>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M3 21a9 9 0 0118 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="brand-title">UserHub</div>
            <div className="brand-sub">User Management Console</div>
          </div>
        </div>

        <nav className="header-actions">
          <button className="btn btn-primary" onClick={onAdd}>
            <span aria-hidden>＋</span> New user
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;
