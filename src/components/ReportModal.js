import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { submitReport } from '../api';
import './ReportModal.css';

const REASONS = [
  'Property does not exist',
  'Fake information',
  'Wrong contact details',
  'Unauthorized listing',
  'Fraud / Scam',
  'Offensive content',
  'Other',
];

export default function ReportModal({ property, onClose }) {
  const [form, setForm] = useState({
    reason:        '',
    details:       '',
    reporterName:  '',
    reporterPhone: '',
  });
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.reason) {
      toast.error('Please select a reason.'); return;
    }
    setLoading(true);
    try {
      await submitReport({
        propertyId:    property._id,
        reason:        form.reason,
        details:       form.details,
        reporterName:  form.reporterName || 'Anonymous',
        reporterPhone: form.reporterPhone,
      });
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay report-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box report-box">

        {/* Header */}
        <div className="report-header">
          <div>
            <h2>🚩 Report Listing</h2>
            <p>{property.title}</p>
          </div>
          <button className="lp-close" onClick={onClose}>✕</button>
        </div>

        {submitted ? (
          <div className="report-success">
            <div style={{ fontSize: '2.5rem' }}>✅</div>
            <h3>Report Submitted</h3>
            <p>Thank you for helping keep Nivas24 safe. Our team will review this listing within 24 hours.</p>
            <button className="btn btn-ghost btn-full" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <form className="report-form" onSubmit={handleSubmit}>

            {/* Reason */}
            <div className="form-group">
              <label className="form-label">Reason for Report *</label>
              <div className="report-reasons">
                {REASONS.map((r) => (
                  <label
                    key={r}
                    className={'report-reason' + (form.reason === r ? ' selected' : '')}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r}
                      checked={form.reason === r}
                      onChange={handleChange}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            {/* Additional details */}
            <div className="form-group">
              <label className="form-label">
                Additional Details
                <span className="form-hint"> (optional)</span>
              </label>
              <textarea
                className="form-textarea"
                name="details"
                value={form.details}
                onChange={handleChange}
                placeholder="Describe the issue in more detail…"
                rows={3}
              />
            </div>

            {/* Reporter info */}
            <div className="report-row">
              <div className="form-group">
                <label className="form-label">
                  Your Name
                  <span className="form-hint"> (optional)</span>
                </label>
                <input
                  className="form-input"
                  name="reporterName"
                  value={form.reporterName}
                  onChange={handleChange}
                  placeholder="Anonymous"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Your Phone
                  <span className="form-hint"> (optional)</span>
                </label>
                <input
                  className="form-input"
                  name="reporterPhone"
                  type="tel"
                  value={form.reporterPhone}
                  onChange={handleChange}
                  placeholder="+92 300 0000000"
                />
              </div>
            </div>

            <div className="report-note">
              ⚠️ False reports may result in action against the reporter. Please only report genuine issues.
            </div>

            <div className="report-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-danger" disabled={loading}>
                {loading ? 'Submitting…' : '🚩 Submit Report'}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}