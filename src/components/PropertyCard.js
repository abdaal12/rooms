import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';

export default function PropertyCard({ property }) {
  const navigate = useNavigate();

  if (!property) return null;

  const title       = property.title       || 'Untitled Property';
  const address     = property.address     || '';
  const area        = property.area        || '';
  const city        = property.city        || '';
  const priceMin    = property.priceMin    || 0;
  const priceMax    = property.priceMax    || 0;
  const roomType    = property.roomType    || 'Room';
  const images      = Array.isArray(property.images)    ? property.images    : [];
  const amenities   = Array.isArray(property.amenities) ? property.amenities : [];
  const isAvailable = property.isAvailable !== false;

  // Cloudinary returns full URL — use directly, no prefix needed
  const imgSrc = images.length > 0 ? images[0] : null;

  return (
    <div
      className="property-card card"
      onClick={() => navigate(`/property/${property._id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/property/${property._id}`); }}
    >
      {/* Image */}
      <div className="pc-image-wrap">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="pc-image"
            loading="lazy"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <div className="pc-image-placeholder">
            <span role="img" aria-label="house">🏠</span>
          </div>
        )}

        <div className="pc-image-badges">
          <span className="badge badge-teal">{roomType}</span>
          {!isAvailable && <span className="badge badge-red">Not Available</span>}
        </div>

        {images.length > 1 && (
          <div className="pc-image-count">🖼 {images.length} photos</div>
        )}
      </div>

      {/* Body */}
      <div className="pc-body">
        <h3 className="pc-title">{title}</h3>

        <div className="pc-location">
          <span>📍</span>
          <span>{[address, area, city].filter(Boolean).join(', ')}</span>
        </div>

        {amenities.length > 0 && (
          <div className="pc-amenities">
            {amenities.slice(0, 3).map((a, i) => (
              <span key={i} className="pc-amenity">✓ {a}</span>
            ))}
            {amenities.length > 3 && (
              <span className="pc-amenity pc-amenity-more">+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        <div className="pc-footer">
          <div className="pc-price">
            <span className="pc-price-label">Rent</span>
            <span className="pc-price-value">
              Rs. {priceMin.toLocaleString()}
              {priceMax && priceMax !== priceMin ? ` – ${priceMax.toLocaleString()}` : ''}
            </span>
            <span className="pc-price-unit">/mo</span>
          </div>
          <div className="pc-view-btn">View Details →</div>
        </div>
      </div>
    </div>
  );
}