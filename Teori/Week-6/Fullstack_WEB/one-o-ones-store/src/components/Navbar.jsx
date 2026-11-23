import React from 'react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

function Navbar({ totalItems }) {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Logo & Brand */}
        <div className="navbar-brand">
          <div className="brand-badge">
            <span className="brand-badge-text">101</span>
          </div>
          <div className="brand-text">
            <h1 className="brand-title">ONE 'O ONES</h1>
            <span className="brand-subtitle">Official Merch & Vinyl Catalog</span>
          </div>
        </div>

        {/* Center / Course Tag */}
        <div className="navbar-pill">
          <span className="pill-dot"></span>
          <span className="pill-text">Bab 6 • React Dasar</span>
        </div>

        {/* Right Info */}
        <div className="navbar-actions">
          <div className="catalog-counter" title="Total item terdaftar di katalog">
            <ArchiveBoxIcon className="counter-icon-svg" />
            <span className="counter-label">Total Katalog:</span>
            <span className="counter-value">{totalItems} Item</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
