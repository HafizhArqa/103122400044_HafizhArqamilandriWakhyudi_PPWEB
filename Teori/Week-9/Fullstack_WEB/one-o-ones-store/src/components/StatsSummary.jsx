import React from 'react';
import {
  MusicalNoteIcon,
  ArchiveBoxIcon,
  TagIcon,
  RectangleStackIcon,
} from '@heroicons/react/24/outline';

function StatsSummary({ products }) {
  const totalProducts = products.length;
  const totalStock = products.reduce((acc, item) => acc + Number(item.stock || 0), 0);
  const avgPrice = totalProducts > 0 
    ? (products.reduce((acc, item) => acc + Number(item.price || 0), 0) / totalProducts).toFixed(2) 
    : '0.00';
  
  // Count by categories
  const categoriesCount = new Set(products.map((p) => p.category)).size;

  return (
    <section className="stats-grid" aria-label="Ringkasan Statistik Katalog">
      <div className="stat-card stat-cyan">
        <div className="stat-icon-wrapper">
          <MusicalNoteIcon className="stat-icon-svg" />
        </div>
        <div className="stat-details">
          <span className="stat-label">Total Produk</span>
          <span className="stat-number">{totalProducts}</span>
          <span className="stat-desc">Entitas terdaftar</span>
        </div>
      </div>

      <div className="stat-card stat-amber">
        <div className="stat-icon-wrapper">
          <ArchiveBoxIcon className="stat-icon-svg" />
        </div>
        <div className="stat-details">
          <span className="stat-label">Total Stok Fisik</span>
          <span className="stat-number">{totalStock}</span>
          <span className="stat-desc">Unit siap kirim</span>
        </div>
      </div>

      <div className="stat-card stat-teal">
        <div className="stat-icon-wrapper">
          <TagIcon className="stat-icon-svg" />
        </div>
        <div className="stat-details">
          <span className="stat-label">Rata-rata Harga</span>
          <span className="stat-number">${avgPrice}</span>
          <span className="stat-desc">Per rilisan produk</span>
        </div>
      </div>

      <div className="stat-card stat-purple">
        <div className="stat-icon-wrapper">
          <RectangleStackIcon className="stat-icon-svg" />
        </div>
        <div className="stat-details">
          <span className="stat-label">Kategori Aktif</span>
          <span className="stat-number">{categoriesCount}</span>
          <span className="stat-desc">Vinyl, Kaset & Merch</span>
        </div>
      </div>
    </section>
  );
}

export default StatsSummary;
