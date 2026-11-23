import React from 'react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';

function Navbar({ totalItems, apiStatus }) {
  const statusLabel =
    apiStatus === 'connected'
      ? 'NestJS API :3000 Connected'
      : apiStatus === 'connecting'
        ? 'Menghubungkan ke API...'
        : 'API Offline (:3000)';

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
        <div className="navbar-center-tags">
          <div className="navbar-pill">
            <span className="pill-dot"></span>
            <span className="pill-text">Bab 9 • NestJS MVC + React</span>
          </div>
          <div
            className={`api-status-badge status-${apiStatus}`}
            title="Status koneksi frontend React ke backend NestJS"
          >
            <span className="api-status-dot"></span>
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* Right Info */}
        <div className="navbar-actions">
          <div className="catalog-counter" title="Total item tersimpan di backend NestJS">
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
