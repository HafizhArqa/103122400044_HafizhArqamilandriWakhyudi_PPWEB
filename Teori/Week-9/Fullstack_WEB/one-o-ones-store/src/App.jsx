import { useCallback, useEffect, useState } from 'react';
import {
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Navbar from './components/Navbar';
import StatsSummary from './components/StatsSummary';
import ProductForm from './components/ProductForm';
import ProductList from './components/ProductList';
import Footer from './components/Footer';
import {
  clearAllProducts,
  createProduct,
  deleteProduct,
  fetchProducts,
  resetProducts,
  updateProduct,
} from './services/productApi';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('connecting');
  const [apiError, setApiError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((type, message) => {
    setToast({ type, message });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // GET /products saat aplikasi dimuat
  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setApiError('');
    setApiStatus('connecting');
    try {
      const data = await fetchProducts();
      setProducts([...data].reverse());
      setApiStatus('connected');
    } catch (err) {
      setApiStatus('offline');
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;

    fetchProducts()
      .then((data) => {
        if (isCancelled) return;
        setProducts([...data].reverse());
        setApiStatus('connected');
        setApiError('');
      })
      .catch((err) => {
        if (isCancelled) return;
        setApiStatus('offline');
        setApiError(err.message);
      })
      .finally(() => {
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // POST /products
  const handleCreateProduct = async (payload) => {
    const created = await createProduct(payload);
    setProducts((prev) => [created, ...prev]);
    setApiStatus('connected');
    showToast(
      'success',
      `POST /products berhasil: "${created.name}" ditambahkan ke backend (ID #${created.id}).`,
    );
    return created;
  };

  // PATCH /products/:id
  const handleUpdateProduct = async (productId, payload) => {
    const updated = await updateProduct(productId, payload);
    setProducts((prev) =>
      prev.map((item) => (item.id === productId ? updated : item)),
    );
    setEditingProduct(null);
    setApiStatus('connected');
    showToast(
      'success',
      `PATCH /products/${productId} berhasil: "${updated.name}" diperbarui di backend.`,
    );
    return updated;
  };

  // Masuk mode Edit dari tombol pada kartu produk
  const handleStartEdit = (product) => {
    setEditingProduct(product);
    const formEl = document.getElementById('product-form-section');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // DELETE /products/:id
  const handleDeleteProduct = async (productId) => {
    setDeletingId(productId);
    try {
      const result = await deleteProduct(productId);
      setProducts((prev) => prev.filter((item) => item.id !== productId));
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
      showToast(
        'success',
        result.message || `DELETE /products/${productId} berhasil.`,
      );
    } catch (err) {
      showToast('error', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // POST /products/reset
  const handleResetInitialData = async () => {
    try {
      const result = await resetProducts();
      setProducts([...result.data].reverse());
      setEditingProduct(null);
      setApiStatus('connected');
      setApiError('');
      showToast('success', result.message);
    } catch (err) {
      showToast('error', err.message);
    }
  };

  // DELETE /products/all
  const handleClearAll = async () => {
    try {
      const result = await clearAllProducts();
      setProducts([]);
      setEditingProduct(null);
      showToast('success', result.message);
    } catch (err) {
      showToast('error', err.message);
    }
  };

  const nextSkuNumber =
    products.reduce((maxId, item) => Math.max(maxId, Number(item.id) || 0), 7) +
    1;

  return (
    <div className="app-container">
      {/* 1. Komponen Header / Navbar */}
      <Navbar totalItems={products.length} apiStatus={apiStatus} />

      {/* Global Feedback Banner */}
      {toast && (
        <div className={`global-toast toast-${toast.type}`} role="status">
          {toast.type === 'success' ? (
            <CheckCircleIcon className="alert-svg-icon" />
          ) : (
            <ExclamationTriangleIcon className="alert-svg-icon" />
          )}
          <span>{toast.message}</span>
          <button
            type="button"
            className="toast-close-btn"
            onClick={() => setToast(null)}
            aria-label="Tutup notifikasi"
          >
            <XMarkIcon className="btn-icon-sm" />
          </button>
        </div>
      )}

      {/* Konten Utama */}
      <main className="main-content-layout">
        {/* Banner Hero Pengantar */}
        <section className="hero-banner">
          <div className="hero-badge">
            <span className="hero-pulse"></span>
            <span>Fullstack React + NestJS MVC • ONE 'O ONES Store</span>
          </div>
          <h2 className="hero-title">
            Katalog Merchandise & Diskografi Artis
          </h2>
          <p className="hero-description">
            Kelola data rilisan album fisik (Vinyl, Kaset Analog) dan merchandise
            tur resmi secara penuh melalui <strong>Backend NestJS REST API</strong>{' '}
            (<code>GET</code>, <code>POST</code>, <code>PATCH</code>,{' '}
            <code>DELETE</code>) dengan validasi DTO global dan penanganan
            exception bawaan NestJS.
          </p>
        </section>

        {/* 2. Komponen Ringkasan Statistik */}
        <StatsSummary products={products} />

        {/* Layout 2 Kolom untuk Form & Info Singkat */}
        <div className="content-grid">
          {/* 3. Komponen Form Tambah & Edit Data */}
          <div className="form-column">
            <ProductForm
              key={editingProduct ? `edit-${editingProduct.id}` : `create-${nextSkuNumber}`}
              onCreateProduct={handleCreateProduct}
              onUpdateProduct={handleUpdateProduct}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
              nextSkuNumber={nextSkuNumber}
            />
          </div>

          {/* Kolom Informasi Arsitektur Bab 9 */}
          <aside className="guide-column">
            <div className="guide-card">
              <h3 className="guide-title">
                <LightBulbIcon className="guide-title-icon" />
                <span>Alur Integrasi NestJS MVC</span>
              </h3>
              <ul className="guide-list">
                <li>
                  <strong>Read (GET):</strong> Daftar katalog diambil otomatis
                  dari <code>GET /products</code> yang menyimpan array in-memory
                  di <code>ProductsService</code>.
                </li>
                <li>
                  <strong>Create (POST):</strong> Formulir mengirim JSON ke{' '}
                  <code>POST /products</code>. Global{' '}
                  <code>ValidationPipe</code> memvalidasi SKU, harga, stok,
                  kategori, dan tanggal rilis.
                </li>
                <li>
                  <strong>Update (PATCH):</strong> Klik tombol{' '}
                  <em>&ldquo;Edit&rdquo;</em> pada kartu produk untuk memuat
                  data ke form dan memperbaruinya via{' '}
                  <code>PATCH /products/:id</code>.
                </li>
                <li>
                  <strong>Delete (DELETE):</strong> Klik tombol{' '}
                  <em>&ldquo;Hapus&rdquo;</em> untuk menghapus entitas dari
                  array server via <code>DELETE /products/:id</code>.
                </li>
                <li>
                  <strong>Exception NestJS:</strong> Coba kirim SKU duplikat (
                  <code>101-VNL-001</code>) untuk memicu{' '}
                  <code>409 ConflictException</code> atau input kosong untuk{' '}
                  <code>400 BadRequestException</code>.
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* 4 & 5. Komponen Daftar Produk & Kartu Produk */}
        <ProductList
          products={products}
          isLoading={isLoading}
          apiError={apiError}
          editingProductId={editingProduct?.id ?? null}
          deletingId={deletingId}
          onEditProduct={handleStartEdit}
          onDeleteProduct={handleDeleteProduct}
          onResetInitialData={handleResetInitialData}
          onClearAll={handleClearAll}
          onRetryFetch={loadProducts}
        />
      </main>

      {/* 6. Komponen Footer */}
      <Footer />
    </div>
  );
}

export default App;
