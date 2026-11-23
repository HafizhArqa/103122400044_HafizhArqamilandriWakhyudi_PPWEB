import React, { useState } from 'react';
import {
  PlusCircleIcon,
  PlusIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { ICON_OPTIONS } from '../data/iconOptions';

function ProductForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Vinyl',
    price: '',
    stock: '',
    editionBadge: 'Limited Edition',
    description: '',
    icon: 'disc',
  });

  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle generic controlled input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formError) setFormError('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      setFormError('Nama produk tidak boleh kosong!');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Harga produk harus berupa angka lebih dari 0!');
      return;
    }
    if (!formData.stock || Number(formData.stock) < 0) {
      setFormError('Jumlah stok tidak boleh bernilai negatif!');
      return;
    }
    if (!formData.description.trim()) {
      setFormError('Deskripsi produk wajib diisi.');
      return;
    }

    // Determine theme color based on category
    let themeColor = 'cyan';
    if (formData.category === 'Vinyl') themeColor = 'amber';
    else if (formData.category === 'Cassette') themeColor = 'purple';
    else if (formData.category === 'Apparel') themeColor = 'teal';
    else if (formData.category === 'Collectible') themeColor = 'pink';

    const newProduct = {
      id: Date.now(), // Unique key
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock, 10),
      editionBadge: formData.editionBadge.trim() || 'Official Release',
      description: formData.description.trim(),
      icon: formData.icon,
      themeColor: themeColor,
    };

    onAddProduct(newProduct);

    // Reset Form
    setFormData({
      name: '',
      category: 'Vinyl',
      price: '',
      stock: '',
      editionBadge: 'Limited Edition',
      description: '',
      icon: 'disc',
    });
    setFormError('');
    setSuccessMessage(`Berhasil menambahkan "${newProduct.name}" ke katalog!`);
    setTimeout(() => setSuccessMessage(''), 3500);
  };

  return (
    <section className="form-card" aria-labelledby="form-heading">
      <div className="form-header">
        <div className="form-title-wrap">
          <span className="badge-tag">Entitas Data: Produk</span>
          <h2 id="form-heading" className="form-title">
            <PlusCircleIcon className="form-title-icon" />
            <span>Tambah Produk Merchandise</span>
          </h2>
          <p className="form-subtitle">
            Input controlled component untuk menambah entitas rilisan fisik atau apparel artis ONE 'O ONES.
          </p>
        </div>
      </div>

      {formError && (
        <div className="alert alert-error" role="alert">
          <ExclamationTriangleIcon className="alert-svg-icon" />
          <span>{formError}</span>
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success" role="status">
          <CheckCircleIcon className="alert-svg-icon" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-grid">
          {/* Nama Produk */}
          <div className="form-group col-span-2">
            <label htmlFor="prod-name" className="form-label">
              Nama Produk <span className="req">*</span>
            </label>
            <input
              id="prod-name"
              name="name"
              type="text"
              placeholder="Contoh: 8-Bit Odyssey Vinyl Deluxe Boxset"
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
              placeholder="Contoh: Bold Edition, Tour Special"
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
              placeholder="Contoh: 35.00"
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
              placeholder="Contoh: 25"
              value={formData.stock}
              onChange={handleChange}
              className="form-input"
            />
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
                    onClick={() => setFormData((prev) => ({ ...prev, icon: opt.id }))}
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
              placeholder="Tuliskan spesifikasi produk, trek audio, atau material merchandise..."
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
            ></textarea>
          </div>
        </div>

        {/* Submit Button */}
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            <PlusIcon className="btn-icon" />
            <span>Tambah ke Katalog</span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default ProductForm;
