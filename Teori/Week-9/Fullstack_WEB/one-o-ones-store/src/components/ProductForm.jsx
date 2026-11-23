import React, { useState } from 'react';
import {
  PlusCircleIcon,
  PlusIcon,
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { ICON_OPTIONS } from '../data/iconOptions';

const CATEGORY_SKU_PREFIX = {
  Vinyl: 'VNL',
  Cassette: 'CST',
  Apparel: 'APR',
  Collectible: 'CLB',
};

const TODAY_ISO = new Date().toISOString().slice(0, 10);

function buildDefaultSku(category, nextNumber = 8) {
  const code = CATEGORY_SKU_PREFIX[category] || 'MRC';
  return `101-${code}-${String(nextNumber).padStart(3, '0')}`;
}

function getInitialFormState(editingProduct, nextSkuNumber) {
  if (editingProduct) {
    return {
      sku: editingProduct.sku || '',
      name: editingProduct.name || '',
      category: editingProduct.category || 'Vinyl',
      price: String(editingProduct.price ?? ''),
      stock: String(editingProduct.stock ?? ''),
      editionBadge: editingProduct.editionBadge || 'Official Release',
      description: editingProduct.description || '',
      icon: editingProduct.icon || 'disc',
      releaseDate: editingProduct.releaseDate || TODAY_ISO,
      isLimitedEdition: Boolean(editingProduct.isLimitedEdition),
    };
  }
  return {
    sku: buildDefaultSku('Vinyl', nextSkuNumber),
    name: '',
    category: 'Vinyl',
    price: '',
    stock: '',
    editionBadge: 'Limited Edition',
    description: '',
    icon: 'disc',
    releaseDate: TODAY_ISO,
    isLimitedEdition: true,
  };
}

function ProductForm({
  onCreateProduct,
  onUpdateProduct,
  editingProduct,
  onCancelEdit,
  nextSkuNumber,
}) {
  const isEditing = Boolean(editingProduct);

  const [formData, setFormData] = useState(() =>
    getInitialFormState(editingProduct, nextSkuNumber),
  );
  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      };
      // Saat mode tambah & kategori berubah, bantu sesuaikan prefix SKU jika masih berformat default
      if (name === 'category' && !isEditing && /^101-[A-Z]{3}-\d{3}$/.test(prev.sku)) {
        const suffix = prev.sku.split('-')[2];
        next.sku = `101-${CATEGORY_SKU_PREFIX[value] || 'MRC'}-${suffix}`;
      }
      return next;
    });
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleGenerateSku = () => {
    setFormData((prev) => ({
      ...prev,
      sku: buildDefaultSku(prev.category, nextSkuNumber),
    }));
    if (formErrors.length > 0) setFormErrors([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage('');

    let themeColor = 'cyan';
    if (formData.category === 'Vinyl') themeColor = 'amber';
    else if (formData.category === 'Cassette') themeColor = 'purple';
    else if (formData.category === 'Apparel') themeColor = 'teal';
    else if (formData.category === 'Collectible') themeColor = 'pink';

    const payload = {
      sku: formData.sku.trim().toUpperCase(),
      name: formData.name.trim(),
      category: formData.category,
      price: formData.price === '' ? NaN : Number(formData.price),
      stock: formData.stock === '' ? NaN : Number(formData.stock),
      editionBadge: formData.editionBadge.trim() || 'Official Release',
      description: formData.description.trim(),
      icon: formData.icon,
      themeColor,
      releaseDate: formData.releaseDate,
      isLimitedEdition: Boolean(formData.isLimitedEdition),
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        const updated = await onUpdateProduct(editingProduct.id, payload);
        setSuccessMessage(
          `Berhasil memperbarui "${updated.name}" (ID #${updated.id}) melalui PATCH /products/${updated.id}.`,
        );
      } else {
        const created = await onCreateProduct(payload);
        setFormData(getInitialFormState(null, created.id + 1));
        setSuccessMessage(
          `Berhasil menyimpan "${created.name}" (SKU: ${created.sku}) melalui POST /products!`,
        );
      }
      setTimeout(() => setSuccessMessage(''), 4500);
    } catch (err) {
      const messages =
        Array.isArray(err.messages) && err.messages.length > 0
          ? err.messages
          : [err.message || 'Terjadi kesalahan saat mengirim data ke backend.'];
      setFormErrors(messages);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="product-form-section"
      className={`form-card ${isEditing ? 'edit-mode' : ''}`}
      aria-labelledby="form-heading"
    >
      <div className="form-header">
        <div className="form-title-wrap">
          <div className="form-header-top-row">
            <span className={`badge-tag ${isEditing ? 'badge-amber' : ''}`}>
              {isEditing
                ? `Mode Edit • PATCH /products/${editingProduct.id}`
                : 'Entitas Data: Product • POST /products'}
            </span>
            {isEditing && (
              <button
                type="button"
                className="btn-cancel-edit"
                onClick={onCancelEdit}
              >
                <XMarkIcon className="btn-icon-sm" />
                <span>Batal Edit</span>
              </button>
            )}
          </div>
          <h2 id="form-heading" className="form-title">
            {isEditing ? (
              <PencilSquareIcon className="form-title-icon edit-icon" />
            ) : (
              <PlusCircleIcon className="form-title-icon" />
            )}
            <span>
              {isEditing
                ? `Edit Produk Merchandise #${editingProduct.id}`
                : 'Tambah Produk Merchandise'}
            </span>
          </h2>
          <p className="form-subtitle">
            {isEditing
              ? `Memperbarui data "${editingProduct.name}" langsung ke backend NestJS dengan validasi UpdateProductDto.`
              : 'Formulir terhubung ke REST API NestJS (CreateProductDto + global ValidationPipe + ConflictException).'}
          </p>
        </div>
      </div>

      {formErrors.length > 0 && (
        <div className="alert alert-error alert-stack" role="alert">
          <div className="alert-header-line">
            <ExclamationTriangleIcon className="alert-svg-icon" />
            <strong>Validasi / Error dari Backend NestJS:</strong>
          </div>
          <ul className="alert-error-list">
            {formErrors.map((msg, idx) => (
              <li key={idx}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="status">
          <CheckCircleIcon className="alert-svg-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form" noValidate>
        <div className="form-grid">
          {/* Kode SKU */}
          <div className="form-group">
            <label htmlFor="prod-sku" className="form-label">
              Kode SKU <span className="req">*</span>
            </label>
            <div className="sku-input-row">
              <input
                id="prod-sku"
                name="sku"
                type="text"
                placeholder="101-VNL-008"
                value={formData.sku}
                onChange={handleChange}
                className="form-input form-input-mono"
                autoComplete="off"
              />
              {!isEditing && (
                <button
                  type="button"
                  className="btn-sku-suggest"
                  onClick={handleGenerateSku}
                  title="Buat saran kode SKU otomatis"
                >
                  <SparklesIcon className="btn-icon-sm" />
                  <span>Auto</span>
                </button>
              )}
            </div>
          </div>

          {/* Tanggal Rilis */}
          <div className="form-group">
            <label htmlFor="prod-release-date" className="form-label">
              Tanggal Rilis <span className="req">*</span>
            </label>
            <input
              id="prod-release-date"
              name="releaseDate"
              type="date"
              value={formData.releaseDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Nama Produk */}
          <div className="form-group col-span-2">
            <label htmlFor="prod-name" className="form-label">
              Nama Produk <span className="req">*</span>
            </label>
            <input
              id="prod-name"
              name="name"
              type="text"
              placeholder="Contoh: Ocean Echoes Acoustic Sessions EP Vinyl"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              autoComplete="off"
            />
          </div>

          {/* Kategori */}
          <div className="form-group">
            <label htmlFor="prod-category" className="form-label">
              Kategori <span className="req">*</span>
            </label>
            <select
              id="prod-category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Vinyl">Vinyl (Piringan Hitam)</option>
              <option value="Cassette">Cassette (Kaset Pita)</option>
              <option value="Apparel">Apparel & Outerwear</option>
              <option value="Collectible">Collectible & Souvenir</option>
            </select>
          </div>

          {/* Badge Edisi */}
          <div className="form-group">
            <label htmlFor="prod-badge" className="form-label">
              Badge / Edisi Rilis
            </label>
            <input
              id="prod-badge"
              name="editionBadge"
              type="text"
              placeholder="Contoh: Signed Pressing, Tour Special"
              value={formData.editionBadge}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Harga */}
          <div className="form-group">
            <label htmlFor="prod-price" className="form-label">
              Harga (USD $) <span className="req">*</span>
            </label>
            <input
              id="prod-price"
              name="price"
              type="number"
              step="0.01"
              min="0.5"
              placeholder="Contoh: 42.50"
              value={formData.price}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Stok */}
          <div className="form-group">
            <label htmlFor="prod-stock" className="form-label">
              Jumlah Stok Fisik <span className="req">*</span>
            </label>
            <input
              id="prod-stock"
              name="stock"
              type="number"
              min="0"
              placeholder="Contoh: 15"
              value={formData.stock}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {/* Status Edisi Terbatas */}
          <div className="form-group col-span-2">
            <label className="checkbox-row" htmlFor="prod-limited">
              <input
                id="prod-limited"
                name="isLimitedEdition"
                type="checkbox"
                checked={formData.isLimitedEdition}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>
                <strong>Edisi Terbatas (Limited Edition)</strong> — Tandai rilisan
                sebagai koleksi terbatas (field boolean pada Entity NestJS)
              </span>
            </label>
          </div>

          {/* Ikon Album / Produk */}
          <div className="form-group col-span-2">
            <label className="form-label">Pilih Simbol Visual Rilisan:</label>
            <div className="icon-selector">
              {ICON_OPTIONS.map((opt) => {
                const IconComponent = opt.Icon;
                return (
                  <button
                    type="button"
                    key={opt.id}
                    className={`icon-choice-btn ${formData.icon === opt.id ? 'selected' : ''}`}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, icon: opt.id }))
                    }
                    title={opt.label}
                  >
                    <IconComponent className="choice-heroicon" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deskripsi */}
          <div className="form-group col-span-2">
            <label htmlFor="prod-desc" className="form-label">
              Deskripsi Produk <span className="req">*</span>
            </label>
            <textarea
              id="prod-desc"
              name="description"
              rows="3"
              placeholder="Tuliskan spesifikasi produk minimal 10 karakter (trek audio, material, atau bonus koleksi)..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              <XMarkIcon className="btn-icon" />
              <span>Batal</span>
            </button>
          )}
          <button
            type="submit"
            className={`btn ${isEditing ? 'btn-amber' : 'btn-primary'}`}
            disabled={isSubmitting}
          >
            {isEditing ? (
              <CheckIcon className="btn-icon" />
            ) : (
              <PlusIcon className="btn-icon" />
            )}
            <span>
              {isSubmitting
                ? 'Menyimpan ke API...'
                : isEditing
                  ? 'Simpan Perubahan (PATCH)'
                  : 'Tambah ke Katalog (POST)'}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
