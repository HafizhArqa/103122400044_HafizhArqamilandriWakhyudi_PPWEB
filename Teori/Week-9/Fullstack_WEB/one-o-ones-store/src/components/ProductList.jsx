import React, { useState } from 'react';
import {
  TrashIcon,
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  ArchiveBoxXMarkIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import ProductCard from './ProductCard';

function ProductList({
  products,
  isLoading,
  apiError,
  editingProductId,
  deletingId,
  onEditProduct,
  onDeleteProduct,
  onResetInitialData,
  onClearAll,
  onRetryFetch,
}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchKeyword, setSearchKeyword] = useState('');

  const categories = ['Semua', 'Vinyl', 'Cassette', 'Apparel', 'Collectible'];

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Semua' || item.category === selectedCategory;
    const kw = searchKeyword.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(kw) ||
      (item.sku || '').toLowerCase().includes(kw) ||
      item.description.toLowerCase().includes(kw) ||
      item.editionBadge.toLowerCase().includes(kw);
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="catalog-section" aria-labelledby="catalog-heading">
      {/* Catalog Controls Header */}
      <div className="catalog-header-bar">
        <div>
          <span className="badge-tag">Katalog Toko • GET /products</span>
          <h2 id="catalog-heading" className="catalog-heading">
            Daftar Rilisan & Merchandise
          </h2>
          <p className="catalog-subheading">
            Data diambil secara langsung dari backend NestJS ({products.length}{' '}
            total entitas terdata di memori server)
          </p>
        </div>

        {/* Global Catalog Quick Actions */}
        <div className="catalog-quick-actions">
          {products.length > 0 && (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onClearAll}
              title="Kosongkan semua data di backend untuk menguji conditional rendering"
            >
              <TrashIcon className="btn-icon" />
              <span>Kosongkan Semua Data</span>
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-cyan"
            onClick={onResetInitialData}
            title="Muat ulang 7 produk merchandise default melalui POST /products/reset"
          >
            <ArrowPathIcon className="btn-icon" />
            <span>Reset ke Data Awal</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-search-container">
        <div
          className="category-tabs"
          role="tablist"
          aria-label="Filter Kategori"
        >
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

        <div className="search-box">
          <span className="search-icon">
            <MagnifyingGlassIcon className="search-svg" />
          </span>
          <input
            type="text"
            placeholder="Cari nama, SKU, vinyl, atau hoodie..."
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

      {/* Loading / Offline Error / Empty State / Product Grid */}
      {isLoading ? (
        <div className="empty-state-box" role="status">
          <div className="loading-spinner"></div>
          <h3 className="empty-state-title">Memuat Katalog dari Backend NestJS...</h3>
          <p className="empty-state-text">
            Mengirim permintaan <code>GET http://localhost:3000/products</code> ke server.
          </p>
        </div>
      ) : apiError ? (
        <div className="empty-state-box error-state-box" role="alert">
          <div className="empty-state-icon">
            <ExclamationTriangleIcon className="empty-svg error-svg" />
          </div>
          <h3 className="empty-state-title">Gagal Terhubung ke Backend NestJS</h3>
          <p className="empty-state-text">{apiError}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onRetryFetch}
          >
            <ArrowPathIcon className="btn-icon" />
            <span>Coba Hubungkan Ulang</span>
          </button>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-state-box" role="status">
          <div className="empty-state-icon">
            <ArchiveBoxXMarkIcon className="empty-svg" />
          </div>
          <h3 className="empty-state-title">Belum ada data Produk Merchandise</h3>
          <p className="empty-state-text">
            Daftar produk di server NestJS saat ini kosong. Tambahkan produk baru
            melalui formulir di atas atau muat ulang data sampel dari backend.
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
          <p>
            Tidak ditemukan produk untuk pencarian &ldquo;
            <strong>{searchKeyword}</strong>&rdquo; pada kategori{' '}
            <strong>{selectedCategory}</strong>.
          </p>
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
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isEditing={editingProductId === product.id}
              isDeleting={deletingId === product.id}
              onEdit={onEditProduct}
              onDelete={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
