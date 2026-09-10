import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { submitLead } from '../api';
import './LocationPopup.css';

const ADMIN_PHONE = process.env.REACT_APP_ADMIN_PHONE || '+923000000000';
const ADMIN_WHATSAPP = process.env.REACT_APP_ADMIN_WHATSAPP || '923000000000';

export default function LocationPopup({ property, onClose }) {
  const [view, setView] = useState('options');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    whatsapp: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'phone' && !prev.whatsapp) {
        updated.whatsapp = value;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error('Please enter your name and phone number.');
      return;
    }
    setLoading(true);
    try {
      await submitLead({
        propertyId: property._id,
        name: form.name.trim(),
        phone: form.phone.trim(),
        whatsapp: form.whatsapp.trim() || form.phone.trim(),
        type: 'callback',
      });
      setView('success');
    } catch (err) {
      toast.error(
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUrgentCall = () => {
    submitLead({
      propertyId: property._id,
      name: 'Urgent Call',
      phone: 'unknown',
      whatsapp: '',
      type: 'urgent',
    }).catch(function() {});
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const title = property.title || 'Property';
  const area = property.area || '';
  const city = property.city || '';
  const address = property.address || '';
  const locationUrl = property.locationUrl || '';

  return (
    <div className="modal-overlay lp-overlay" onClick={handleOverlayClick}>
      <div className="modal-box lp-box">

        {/* Header */}
        <div className="lp-header">
          <div className="lp-header-text">
            <h2>{title}</h2>
            <p>📍 {[area, city].filter(Boolean).join(', ')}</p>
          </div>
          <button className="lp-close" onClick={onClose}>✕</button>
        </div>

        {/* OPTIONS VIEW */}
        {view === 'options' && (
          <div className="lp-options">

            {locationUrl ? (
              <div className="lp-map">
                <iframe
                  title="Property Location"
                  src={locationUrl}
                  width="100%"
                  height="200"
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : (
              <div className="lp-no-map">
                <span>🗺️</span>
                <p>{[address, area, city].filter(Boolean).join(', ')}</p>
              </div>
            )}

            <p className="lp-options-label">How would you like to connect?</p>

            <div className="lp-option-cards">

              {/* Callback option */}
              <button
                className="lp-option-card lp-option-callback"
                onClick={() => setView('callback')}
              >
                <div className="lp-option-icon">📋</div>
                <div className="lp-option-body">
                  <span className="lp-option-title">Request Callback</span>
                  <span className="lp-option-desc">
                    Fill a short form — we will call you back
                  </span>
                </div>
                <span className="lp-option-arrow">→</span>
              </button>

              {/* Urgent call option */}
              <a
                className="lp-option-card lp-option-urgent"
                href={'tel:' + ADMIN_PHONE}
                onClick={handleUrgentCall}
              >
                <div className="lp-option-icon">📞</div>
                <div className="lp-option-body">
                  <span className="lp-option-title">Urgent Call</span>
                  <span className="lp-option-desc">
                    Tap to call us now — connect instantly
                  </span>
                </div>
                <div className="lp-calling-badge">Call Now</div>
              </a>

            </div>

            {/* WhatsApp */}
            <a
              className="lp-whatsapp-btn"
              href={
                'https://wa.me/' +
                ADMIN_WHATSAPP +
                '?text=' +
                encodeURIComponent(
                  'Hi! I am interested in "' + title + '" in ' + area + ', ' + city + '.'
                )
              }
              target="_blank"
              rel="noreferrer"
            >
              <span>💬</span>
              Chat on WhatsApp
            </a>

          </div>
        )}

        {/* CALLBACK FORM VIEW */}
        {view === 'callback' && (
          <div className="lp-form-wrap">

            <button className="lp-back" onClick={() => setView('options')}>
              ← Back
            </button>

            <div className="lp-form-header">
              <div className="lp-form-icon">📋</div>
              <h3>Request a Callback</h3>
              <p>Fill your details and we will call you back shortly.</p>
            </div>

            <form className="lp-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label className="form-label">Your Name *</label>
                <input
                  className="form-input"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  className="form-input"
                  name="phone"
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  WhatsApp Number
                  <span className="form-hint"> (leave blank if same as phone)</span>
                </label>
                <input
                  className="form-input"
                  name="whatsapp"
                  type="tel"
                  placeholder="+92 300 0000000"
                  value={form.whatsapp}
                  onChange={handleChange}
                />
              </div>

              <div className="lp-property-strip">
                <span>🏠</span>
                <div>
                  <div className="lp-strip-title">{title}</div>
                  <div className="lp-strip-loc">{[area, city].filter(Boolean).join(', ')}</div>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-full lp-submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting…' : '📨 Submit Request'}
              </button>

            </form>
          </div>
        )}

        {/* SUCCESS VIEW */}
        {view === 'success' && (
          <div className="lp-success">
            <div className="lp-success-icon">✅</div>
            <h3>Request Received!</h3>
            <p>
              Thank you, <strong>{form.name}</strong>! We have received your
              callback request for <strong>{title}</strong>.
            </p>
            <p className="lp-success-sub">
              Our team will call you on <strong>{form.phone}</strong> very soon.
            </p>

            <a
              className="lp-whatsapp-btn"
              href={
                'https://wa.me/' +
                ADMIN_WHATSAPP +
                '?text=' +
                encodeURIComponent(
                  'Hi! I just submitted a callback request for "' +
                    title +
                    '". My name is ' +
                    form.name +
                    '.'
                )
              }
              target="_blank"
              rel="noreferrer"
            >
              <span>💬</span>
              Also message us on WhatsApp
            </a>

            <button
              className="btn btn-ghost btn-full"
              onClick={onClose}
              style={{ marginTop: '0.75rem' }}
            >
              Close
            </button>
          </div>
        )}

      </div>
    </div>
  );
}