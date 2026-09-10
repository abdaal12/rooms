import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../api';
import LocationPopup from '../components/LocationPopup';
import './PropertyDetailPage.css';

export default function PropertyDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [property,  setProperty]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [error,     setError]     = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then(({ data }) => { setProperty(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: '5rem' }} />;

  if (error || !property) {
    return (
      <div className="pdp-error">
        <span>😕</span>
        <h2>Property not found</h2>
        <p>This listing may have been removed.</p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          ← Back to listings
        </button>
      </div>
    );
  }

  const images    = Array.isArray(property.images)    ? property.images    : [];
  const amenities = Array.isArray(property.amenities) ? property.amenities : [];

  return (
    <div className="pdp-page">
      <div className="container">

        {/* Breadcrumb */}
        <div className="pdp-breadcrumb">
          <button onClick={() => navigate('/')} className="pdp-back">
            ← Back to listings
          </button>
          <span className="pdp-breadcrumb-sep">·</span>
          <span>{property.area}, {property.city}</span>
        </div>

        <div className="pdp-layout">

          {/* ── LEFT ── */}
          <div className="pdp-left">

            {/* Gallery */}
            <div className="pdp-gallery">
              <div className="pdp-main-img">
                {images.length > 0 ? (
                  <img
                    src={images[activeImg]}
                    alt={`${property.title} - photo ${activeImg + 1}`}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                ) : (
                  <div className="pdp-no-image">
                    <span>🏠</span>
                    <p>No photos available</p>
                  </div>
                )}

                {images.length > 1 && (
                  <div className="pdp-img-counter">
                    {activeImg + 1} / {images.length}
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button
                      className="pdp-arrow pdp-arrow-left"
                      onClick={() =>
                        setActiveImg((p) => p === 0 ? images.length - 1 : p - 1)
                      }
                    >‹</button>
                    <button
                      className="pdp-arrow pdp-arrow-right"
                      onClick={() =>
                        setActiveImg((p) => p === images.length - 1 ? 0 : p + 1)
                      }
                    >›</button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="pdp-thumbs">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      className={'pdp-thumb' + (i === activeImg ? ' active' : '')}
                      onClick={() => setActiveImg(i)}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${i + 1}`}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            {property.description && (
              <div className="pdp-section card">
                <h3 className="pdp-section-title">About this property</h3>
                <p className="pdp-description">{property.description}</p>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="pdp-section card">
                <h3 className="pdp-section-title">Amenities</h3>
                <div className="pdp-amenities">
                  {amenities.map((a, i) => (
                    <div key={i} className="pdp-amenity-item">
                      <span className="pdp-amenity-check">✓</span>
                      <span>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── RIGHT ── */}
          <div className="pdp-right">
            <div className="pdp-info-card card">

              <div className="pdp-info-top">
                <div className="pdp-info-badges">
                  <span className="badge badge-teal">{property.roomType}</span>
                  <span className={'badge ' + (property.isAvailable ? 'badge-green' : 'badge-red')}>
                    {property.isAvailable ? 'Available' : 'Not Available'}
                  </span>
                </div>
                <h1 className="pdp-title">{property.title}</h1>
              </div>

              <div className="pdp-price-wrap">
                <span className="pdp-price-label">Monthly Rent</span>
                <div className="pdp-price">
                  Rs. {(property.priceMin || 0).toLocaleString()}
                  {property.priceMax && property.priceMax !== property.priceMin
                    ? ` – Rs. ${property.priceMax.toLocaleString()}`
                    : ''}
                </div>
                <span className="pdp-price-unit">per month</span>
              </div>

              <div className="pdp-divider" />

              <div className="pdp-details">
                <div className="pdp-detail-row">
                  <span className="pdp-detail-icon">📍</span>
                  <div>
                    <div className="pdp-detail-label">Address</div>
                    <div className="pdp-detail-value">{property.address}</div>
                  </div>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-icon">🏙️</span>
                  <div>
                    <div className="pdp-detail-label">Area</div>
                    <div className="pdp-detail-value">{property.area}, {property.city}</div>
                  </div>
                </div>
                <div className="pdp-detail-row">
                  <span className="pdp-detail-icon">🛏️</span>
                  <div>
                    <div className="pdp-detail-label">Room Type</div>
                    <div className="pdp-detail-value">{property.roomType}</div>
                  </div>
                </div>
                {amenities.length > 0 && (
                  <div className="pdp-detail-row">
                    <span className="pdp-detail-icon">✅</span>
                    <div>
                      <div className="pdp-detail-label">Amenities</div>
                      <div className="pdp-detail-value">{amenities.join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pdp-divider" />

              <div className="pdp-owner">
                <div className="pdp-owner-avatar">
                  {property.ownerName ? property.ownerName.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="pdp-owner-name">{property.ownerName}</div>
                  <div className="pdp-owner-label">Property Owner</div>
                </div>
              </div>

              <button
                className="btn btn-primary btn-full pdp-cta"
                onClick={() => setShowPopup(true)}
                disabled={!property.isAvailable}
              >
                📍 View Location & Contact
              </button>

              {!property.isAvailable && (
                <p className="pdp-unavailable-note">
                  This property is currently not available.
                </p>
              )}
            </div>

            <div className="pdp-listed-date">
              Listed on{' '}
              {new Date(property.createdAt).toLocaleDateString('en-PK', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </div>
          </div>

        </div>
      </div>

      {showPopup && (
        <LocationPopup property={property} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
}