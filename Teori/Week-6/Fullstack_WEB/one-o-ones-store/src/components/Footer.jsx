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
            <p className="academic-title">BAB 6 REACT DASAR • PEKAN 6</p>
            <p className="academic-sub">
              Fondasi Frontend Kerangka Fullstack Web (Pengembangan Berkelanjutan s/d Pekan 14)
            </p>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © {CURRENT_YEAR} ONE 'O ONES. Built with React 19 & Vite.
          </p>
          <div className="footer-tags">
            <span className="footer-tag-item">State & Props</span>
            <span className="footer-tag-item">Controlled Component</span>
            <span className="footer-tag-item">Conditional Rendering</span>
            <span className="footer-tag-item">List & Keys</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
