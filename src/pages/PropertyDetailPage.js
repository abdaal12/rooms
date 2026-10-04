import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperty } from '../api';
import LocationPopup from '../components/LocationPopup';
import ReportModal from '../components/ReportModal';
import './PropertyDetailPage.css';

export default function PropertyDetailPage() {
  const { id }      = useParams();
  const navigate    = useNavigate();

  const [property,   setProperty]   = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [activeImg,  setActiveImg]  = useState(0);
  const [showPopup,  setShowPopup]  = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [error,      setError]      = useState(false);

  useEffect(() => {
    setLoading(true);
    getProperty(id)
      .then(({ data }) => {
        setProperty(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="spinner" style={{ marginTop: '5rem' }} />;
  }

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

        {/* ── Breadcrumb ── */}
        <div className="pdp-breadcrumb">
          <button onClick={() => navigate('/')} className="pdp-back">
            ← Back to listings
          </button>
          <span className="pdp-breadcrumb-sep">·</span>
          <span>{property.area}, {property.city}</span>
        </div>

        <div className="pdp-layout">

          {/* ══════════════════════════════
              LEFT COLUMN
          ══════════════════════════════ */}
          <div className="pdp-left">

            {/* ── Image Gallery ── */}
            <div className="pdp-gallery">

              {/* Main image */}
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

                {/* Image counter */}
                {images.length > 1 && (
                  <div className="pdp-img-counter">
                    {activeImg + 1} / {images.length}
                  </div>
                )}

                {/* Prev / Next arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      className="pdp-arrow pdp-arrow-left"
                      onClick={() =>
                        setActiveImg((prev) =>
                          prev === 0 ? images.length - 1 : prev - 1
                        )
                      }
                    >
                      ‹
                    </button>
                    <button
                      className="pdp-arrow pdp-arrow-right"
                      onClick={() =>
                        setActiveImg((prev) =>
                          prev === images.length - 1 ? 0 : prev + 1
                        )
                      }
                    >
                      ›
                    </button>
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

            {/* ── Description ── */}
            {property.description && (
              <div className="pdp-section card">
                <h3 className="pdp-section-title">About this property</h3>
                <p className="pdp-description">{property.description}</p>
              </div>
            )}

            {/* ── Amenities ── */}
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

            {/* ── Safety Tips ── */}
            <div className="pdp-section card pdp-safety">
              <h3 className="pdp-section-title">🛡️ Safety Tips</h3>
              <ul className="pdp-safety-list">
                <li>Always visit the property in person before making any payment</li>
                <li>Verify ownership documents before signing any agreement</li>
                <li>Never transfer money without a written rental agreement</li>
                <li>If anything seems suspicious, report the listing using the button below</li>
              </ul>
            </div>

          </div>

          {/* ══════════════════════════════
              RIGHT COLUMN
          ══════════════════════════════ */}
          <div className="pdp-right">

            {/* ── Property info card ── */}
            <div className="pdp-info-card card">

              {/* Badges */}
              <div className="pdp-info-top">
                <div className="pdp-info-badges">
                  <span className="badge badge-teal">{property.roomType}</span>
                  <span className={'badge ' + (property.isAvailable ? 'badge-green' : 'badge-red')}>
                    {property.isAvailable ? '✅ Available' : '🔴 Not Available'}
                  </span>
                </div>
                <h1 className="pdp-title">{property.title}</h1>
              </div>

              {/* Price */}
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

              {/* Details */}
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
                    <div className="pdp-detail-value">
                      {property.area}, {property.city}
                    </div>
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

              {/* Owner */}
              <div className="pdp-owner">
                <div className="pdp-owner-avatar">
                  {property.ownerName
                    ? property.ownerName.charAt(0).toUpperCase()
                    : 'O'}
                </div>
                <div>
                  <div className="pdp-owner-name">{property.ownerName}</div>
                  <div className="pdp-owner-label">Property Owner</div>
                </div>
              </div>

              {/* Main CTA */}
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

              <div className="pdp-divider" />

              {/* Listed date */}
              <div className="pdp-listed-date">
                Listed on{' '}
                {new Date(property.createdAt).toLocaleDateString('en-PK', {
                  day:   'numeric',
                  month: 'long',
                  year:  'numeric',
                })}
              </div>

              {/* Report button */}
              <button
                className="report-listing-btn"
                onClick={() => setShowReport(true)}
              >
                🚩 Report this listing
              </button>

            </div>

            {/* ── Nivas24 guarantee strip ── */}
            <div className="pdp-guarantee card">
              <div className="pdp-guarantee-item">
                <span>🔒</span>
                <span>Your data is safe with us</span>
              </div>
              <div className="pdp-guarantee-item">
                <span>📞</span>
                <span>Direct owner contact</span>
              </div>
              <div className="pdp-guarantee-item">
                <span>🚩</span>
                <span>Report suspicious listings</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Location Popup ── */}
      {showPopup && (
        <LocationPopup
          property={property}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* ── Report Modal ── */}
      {showReport && (
        <ReportModal
          property={property}
          onClose={() => setShowReport(false)}
        />
      )}

    </div>
  );
}