import React from 'react';
import {
  TrashIcon,
  PencilSquareIcon,
  CalendarDaysIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import ProductIcon from './ProductIcon';

function ProductCard({
  product,
  onEdit,
  onDelete,
  isEditing = false,
  isDeleting = false,
}) {
  const {
    id,
    sku,
    name,
    category,
    price,
    stock,
    editionBadge,
    description,
    icon,
    themeColor,
    releaseDate,
    isLimitedEdition,
  } = product;

  const isLowStock = stock < 8;

  return (
    <article
      className={`product-card-item theme-${themeColor || 'cyan'} ${isEditing ? 'is-editing-card' : ''}`}
      aria-label={name}
    >
      {/* Visual Artwork Container */}
      <div className="card-artwork">
        <div className="artwork-disc-wrapper">
          {category === 'Vinyl' ? (
            <div className="vinyl-disc">
              <div className="vinyl-groove"></div>
              <div className="vinyl-center">
                <span className="vinyl-icon">
                  <ProductIcon
                    name={icon}
                    category="Vinyl"
                    className="vinyl-heroicon"
                  />
                </span>
                <span className="vinyl-label">101 LP</span>
              </div>
            </div>
          ) : category === 'Cassette' ? (
            <div className="cassette-tape">
              <div className="cassette-spools">
                <div className="spool"></div>
                <div className="spool"></div>
              </div>
              <span className="cassette-icon">
                <ProductIcon
                  name={icon}
                  category="Cassette"
                  className="cassette-heroicon"
                />
              </span>
              <span className="cassette-label">TAPE C-60</span>
            </div>
          ) : (
            <div className="merch-preview">
              <span className="merch-icon">
                <ProductIcon
                  name={icon}
                  category={category}
                  className="merch-heroicon"
                />
              </span>
              <span className="merch-label">MERCH</span>
            </div>
          )}
        </div>

        {/* Top Badges */}
        <span className="edition-badge">{editionBadge}</span>
        <span className="category-pill">{category}</span>
        {isLimitedEdition && (
          <span className="limited-pill" title="Edisi Terbatas">
            <SparklesIcon className="limited-icon" />
            <span>LIMITED</span>
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="card-body">
        <div className="card-sku-row">
          <span className="sku-chip">{sku || `101-PRD-${id}`}</span>
          {releaseDate && (
            <span className="release-date-chip" title="Tanggal Rilis">
              <CalendarDaysIcon className="meta-mini-icon" />
              <span>{releaseDate}</span>
            </span>
          )}
        </div>

        <h3 className="card-title" title={name}>
          {name}
        </h3>
        <p className="card-description">{description}</p>

        {/* Pricing & Stock Row */}
        <div className="card-meta">
          <div className="price-tag">
            <span className="currency">$</span>
            <span className="amount">{Number(price).toFixed(2)}</span>
          </div>
          <div
            className={`stock-status ${isLowStock ? 'stock-low' : 'stock-ok'}`}
          >
            <span className="stock-dot"></span>
            <span>{stock > 0 ? `Sisa: ${stock} pcs` : 'Habis'}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-footer-actions">
          <div className="card-action-group">
            <button
              type="button"
              className="btn-card-edit"
              onClick={() => onEdit(product)}
              title={`Edit ${name} via PATCH /products/${id}`}
            >
              <PencilSquareIcon className="btn-icon-sm" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              className="btn-card-delete"
              onClick={() => onDelete(id)}
              disabled={isDeleting}
              title={`Hapus ${name} via DELETE /products/${id}`}
            >
              <TrashIcon className="btn-icon-sm" />
              <span>{isDeleting ? '...' : 'Hapus'}</span>
            </button>
          </div>
          <span className="item-id-badge">ID #{id}</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
