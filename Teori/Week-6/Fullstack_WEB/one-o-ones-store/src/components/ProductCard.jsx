import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import ProductIcon from './ProductIcon';

function ProductCard({ product, onDelete }) {
  const { id, name, category, price, stock, editionBadge, description, icon, themeColor } = product;

  const isLowStock = stock < 8;

  return (
    <article className={`product-card-item theme-${themeColor || 'cyan'}`} aria-label={name}>
      {/* Visual Artwork Container */}
      <div className="card-artwork">
        <div className="artwork-disc-wrapper">
          {category === 'Vinyl' ? (
            <div className="vinyl-disc">
              <div className="vinyl-groove"></div>
              <div className="vinyl-center">
                <span className="vinyl-icon">
                  <ProductIcon name={icon} category="Vinyl" className="vinyl-heroicon" />
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
                <ProductIcon name={icon} category="Cassette" className="cassette-heroicon" />
              </span>
              <span className="cassette-label">TAPE C-60</span>
            </div>
          ) : (
            <div className="merch-preview">
              <span className="merch-icon">
                <ProductIcon name={icon} category={category} className="merch-heroicon" />
              </span>
              <span className="merch-label">MERCH</span>
            </div>
          )}
        </div>

        {/* Top Badges */}
        <span className="edition-badge">{editionBadge}</span>
        <span className="category-pill">{category}</span>
      </div>

      {/* Product Details */}
      <div className="card-body">
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
          <div className={`stock-status ${isLowStock ? 'stock-low' : 'stock-ok'}`}>
            <span className="stock-dot"></span>
            <span>{stock > 0 ? `Sisa: ${stock} pcs` : 'Habis'}</span>
          </div>
        </div>

        {/* Card Actions */}
        <div className="card-footer-actions">
          <button
            type="button"
            className="btn-card-delete"
            onClick={() => onDelete(id)}
            title={`Hapus ${name} dari katalog`}
          >
            <TrashIcon className="btn-icon-sm" />
            <span>Hapus</span>
          </button>
          <span className="item-id-badge">ID #{id.toString().slice(-4)}</span>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
