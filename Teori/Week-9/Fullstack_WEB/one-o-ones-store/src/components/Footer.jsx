import React from 'react';

const CURRENT_YEAR = new Date().getFullYear();

function Footer() {
  return (
    <footer className="store-footer">
      <div className="footer-content">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-brand-badge">101</span>
            <div>
              <p className="footer-brand-title">ONE 'O ONES STORE</p>
              <p className="footer-brand-sub">Official Artist Merchandise & Audio Discs</p>
            </div>
          </div>

          <div className="footer-academic-info">
            <span className="badge-tag">Tugas Perkuliahan</span>
            <p className="academic-title">BAB 9 NESTJS DASAR + STRUKTUR MVC • PEKAN 9</p>
            <p className="academic-sub">
              Integrasi Fullstack Frontend React 19 dengan Backend REST API NestJS (In-Memory CRUD)
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} ONE 'O ONES. Built with React 19, Vite & NestJS.
          </p>
          <div className="footer-tags">
            <span className="footer-tag-item">NestJS MVC</span>
            <span className="footer-tag-item">CRUD REST API</span>
            <span className="footer-tag-item">ValidationPipe DTO</span>
            <span className="footer-tag-item">NestJS Exceptions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
