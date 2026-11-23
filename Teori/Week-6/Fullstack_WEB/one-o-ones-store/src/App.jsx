import { useState } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import { initialProducts } from './data/initialProducts';
import './App.css';

function App() {
  // State utama (Array) sesuai instruksi 5.a
  const [products, setProducts] = useState(initialProducts);

  // Handler: Tambah item baru dari form controlled component (instruksi 5.b)
  const handleAddProduct = (newProduct) => {
    setProducts((prevProducts) => [newProduct, ...prevProducts]);
  };

  // Handler: Hapus satu item produk berdasarkan ID unik
  const handleDeleteProduct = (productId) => {
    setProducts((prevProducts) =>
      prevProducts.filter((product) => product.id !== productId)
    );
  };

  // Handler: Reset ke data sampel awal
  const handleResetInitialData = () => {
    setProducts(initialProducts);
  };

  // Handler: Kosongkan semua data untuk demonstrasi conditional rendering (instruksi 5.c)
  const handleClearAll = () => {
    setProducts([]);
  };

  return (
    <div className="app-container">
      {/* 1. Komponen Header / Navbar */}
      <Navbar totalItems={products.length} />

      {/* Konten Utama */}
      <main className="main-content-layout">
        {/* Banner Hero Pengantar */}
        <section className="hero-banner">
          <div className="hero-badge">
            <span className="hero-pulse"></span>
            <span>Rilisan Musik & Koleksi Eksklusif ONE 'O ONES</span>
          </div>
          <h2 className="hero-title">
            Katalog Merchandise & Diskografi Artis
          </h2>
          <p className="hero-description">
            Kelola data rilisan album fisik (Vinyl, Kaset Analog) dan merchandise tur resmi.
            Aplikasi ini dibangun menggunakan <strong>React 19 Dasar</strong> dengan state interaktif,
            controlled component form, dan render list dinamis.
          </p>
        </section>

        {/* 2. Komponen Ringkasan Statistik */}
        <StatsSummary products={products} />

        {/* Layout 2 Kolom untuk Form & Info Singkat */}
        <div className="content-grid">
          {/* 3. Komponen Form Tambah Data (Controlled Component) */}
          <div className="form-column">
            <ProductForm onAddProduct={handleAddProduct} />
          </div>

          {/* Kolom Informasi Panduan Singkat */}
          <aside className="guide-column">
            <div className="guide-card">
              <h3 className="guide-title">
                <LightBulbIcon className="guide-title-icon" />
                <span>Petunjuk Interaksi Praktikum</span>
              </h3>
              <ul className="guide-list">
                <li>
                  <strong>Tambah Data:</strong> Isi formulir di samping untuk menambahkan entitas produk baru. State array di <code>App.jsx</code> akan otomatis terupdate.
                </li>
                <li>
                  <strong>Render List (.map):</strong> Setiap item dirender menggunakan komponen <code>ProductCard</code> dengan <code>key</code> unik dari <code>id</code> produk.
                </li>
                <li>
                  <strong>Uji Conditional Rendering:</strong> Hapus semua produk atau klik tombol <em>"Kosongkan Semua Data"</em> pada katalog untuk melihat tampilan <code>"Belum ada data Produk Merchandise"</code>.
                </li>
                <li>
                  <strong>Filter Kategori & Pencarian:</strong> Gunakan tab kategori dan kotak cari untuk menyaring rilisan secara instan.
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* 4 & 5. Komponen Daftar Produk & Kartu Produk */}
        <ProductList
          products={products}
          onDeleteProduct={handleDeleteProduct}
          onResetInitialData={handleResetInitialData}
          onClearAll={handleClearAll}
        />
      </main>

      {/* 6. Komponen Footer */}
      <Footer />
    </div>
  );
}

export default App;
