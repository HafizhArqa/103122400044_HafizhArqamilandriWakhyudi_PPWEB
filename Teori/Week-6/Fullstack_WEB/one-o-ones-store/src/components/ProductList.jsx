import React, { useState } from 'react';
import {
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArchiveBoxXMarkIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

function ProductList({ products, onDeleteProduct, onResetInitialData, onClearAll }) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchKeyword, setSearchKeyword] = useState('');

  const categories = ['Semua', 'Vinyl', 'Cassette', 'Apparel', 'Collectible'];

  // Filter products based on active category & search keyword
  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                          item.editionBadge.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="catalog-section" aria-labelledby="catalog-heading">
      {/* Catalog Controls Header */}
      <div className="catalog-header-bar">
        <div>
          <span className="badge-tag">Katalog Toko</span>
          <h2 id="catalog-heading" className="catalog-heading">
            Daftar Rilisan & Merchandise
          </h2>
          <p className="catalog-subheading">
            Koleksi fisik resmi ONE 'O ONES ({products.length} total entitas terdata)
          </p>
        </div>

        {/* Global Catalog Quick Actions */}
        <div className="catalog-quick-actions">
          {products.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onClearAll}
              title="Kosongkan semua data untuk menguji conditional rendering"
            >
              <TrashIcon className="btn-icon" />
              <span>Kosongkan Semua Data</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-cyan"
            onClick={onResetInitialData}
            title="Muat ulang 7 produk merchandise default"
          >
            <ArrowPathIcon className="btn-icon" />
            <span>Reset ke Data Awal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-container">
        {/* Category Pills */}
        <div className="category-tabs" role="tablist" aria-label="Filter Kategori">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat}
              className={`category-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="search-box">
          <span className="search-icon">
            <MagnifyingGlassIcon className="search-svg" />
          </span>
          <input
            type="text"
            placeholder="Cari vinyl, kaset, atau hoodie..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="search-input"
            aria-label="Cari produk"
          />
          {searchKeyword && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchKeyword('')}
              title="Hapus pencarian"
            >
              <XMarkIcon className="clear-svg" />
            </button>
          )}
        </div>
      </div>

      {/* CONDITIONAL RENDERING UTAMA SESUAI INSTRUKSI SOAL:
          "tampilkan teks 'Belum ada data [nama entitas Anda]' apabila daftar masih kosong" */}
      {products.length === 0 ? (
        <div className="empty-state-box" role="status">
          <div className="empty-state-icon">
            <ArchiveBoxXMarkIcon className="empty-svg" />
          </div>
          <h3 className="empty-state-title">Belum ada data Produk Merchandise</h3>
          <p className="empty-state-text">
            Katalog saat ini masih kosong. Silakan gunakan formulir tambah di atas untuk menambahkan rilisan vinyl atau merchandise baru, atau klik tombol di bawah untuk memuat data sampel.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onResetInitialData}
          >
            <SparklesIcon className="btn-icon" />
            <span>Muat Data Sampel Sekarang</span>
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="empty-filter-box" role="status">
          <div className="empty-filter-icon">
            <MagnifyingGlassIcon className="empty-svg" />
          </div>
          <h3>Tidak ada produk yang cocok</h3>
          <p>Tidak ditemukan produk untuk pencarian "<strong>{searchKeyword}</strong>" pada kategori <strong>{selectedCategory}</strong>.</p>
          <button
            type="button"
            className="btn btn-outline-cyan"
            onClick={() => {
              setSelectedCategory('Semua');
              setSearchKeyword('');
            }}
          >
            <ArrowPathIcon className="btn-icon" />
            <span>Reset Filter Pencarian</span>
          </button>
        </div>
      ) : (
        /* Render List dengan .map() dan unique key */
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
