import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProperty, updateProperty, getProperty } from '../api';
import './AddPropertyPage.css';

const ROOM_TYPES = [
  'Single Room', 'Double Room', 'Studio',
  '1BHK', '2BHK', '3BHK', 'PG', 'Flat',
];

const AMENITIES_LIST = [
  'WiFi', 'AC', 'Geyser', 'Parking', 'Lift',
  'Security Guard', 'Power Backup', 'Washing Machine',
  'Furnished', 'Kitchen', 'Water 24/7', 'CCTV',
];


export default function AddPropertyPage() {
  const navigate    = useNavigate();
  const { id }      = useParams();          // exists when editing
  const isEdit      = Boolean(id);
  const fileRef     = useRef();

  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(isEdit); // loading existing data

  const [form, setForm] = useState({
    title: '', description: '', address: '', area: '', city: '',
    locationUrl: '', priceMin: '', priceMax: '',
    roomType: 'Single Room', ownerName: '', ownerPhone: '',
    ownerWhatsapp: '', amenities: [],
  });

  // New images selected by admin this session
  const [newImages,   setNewImages]   = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);

  // Existing images from DB (edit mode only)
  const [existingImages, setExistingImages] = useState([]);

  // ── Load property data when editing ──────────────────────────────────────
  useEffect(() => {
    if (!isEdit) return;
    setFetching(true);
    getProperty(id)
      .then(({ data }) => {
        setForm({
          title:         data.title        || '',
          description:   data.description  || '',
          address:       data.address      || '',
          area:          data.area         || '',
          city:          data.city         || '',
          locationUrl:   data.locationUrl  || '',
          priceMin:      data.priceMin     || '',
          priceMax:      data.priceMax     || '',
          roomType:      data.roomType     || 'Single Room',
          ownerName:     data.ownerName    || '',
          ownerPhone:    data.ownerPhone   || '',
          ownerWhatsapp: data.ownerWhatsapp|| '',
          amenities:     Array.isArray(data.amenities) ? data.amenities : [],
        });
        setExistingImages(Array.isArray(data.images) ? data.images : []);
      })
      .catch(() => {
        toast.error('Failed to load property data.');
        navigate('/admin');
      })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 6 - existingImages.length);
    setNewImages(files);
    setNewPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removeNewImage = (i) => {
    setNewImages((prev)    => prev.filter((_, idx) => idx !== i));
    setNewPreviews((prev)  => prev.filter((_, idx) => idx !== i));
  };

  // Remove an existing image (edit mode)
  const removeExistingImage = (i) => {
    setExistingImages((prev) => prev.filter((_, idx) => idx !== i));
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.address || !form.area || !form.city) {
      toast.error('Please fill all required fields.'); return;
    }
    if (!form.priceMin || !form.priceMax) {
      toast.error('Please enter the price range.'); return;
    }
    if (Number(form.priceMin) > Number(form.priceMax)) {
      toast.error('Min price cannot be greater than max price.'); return;
    }
    if (!form.ownerName || !form.ownerPhone) {
      toast.error('Owner name and phone are required.'); return;
    }

    setLoading(true);
    try {
      const fd = new FormData();

      // Text fields
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'amenities') {
          val.forEach((a) => fd.append('amenities', a));
        } else {
          fd.append(key, val);
        }
      });

      // Existing images to keep (edit mode)
      existingImages.forEach((img) => fd.append('existingImages', img));

      // New image files
      newImages.forEach((img) => fd.append('images', img));

      if (isEdit) {
        await updateProperty(id, fd);
        toast.success('Property updated successfully!');
      } else {
        await createProperty(fd);
        toast.success('Property listed successfully!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner" style={{ marginTop: '5rem' }} />;

  return (
    <div className="add-page">
      <div className="container">

        {/* Header */}
        <div className="add-header">
          <button className="btn btn-ghost" onClick={() => navigate('/admin')}>
            ← Back
          </button>
          <div>
            <h1>{isEdit ? 'Edit Property' : 'Add New Property'}</h1>
            <p>
              {isEdit
                ? 'Update the details below and save changes.'
                : 'Fill in the details below to publish a new listing.'}
            </p>
          </div>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>

          {/* ── Section 1: Property Details ── */}
          <div className="add-section card">
            <h2 className="add-section-title">🏠 Property Details</h2>

            <div className="add-row">
              <div className="form-group">
                <label className="form-label">Property Title *</label>
                <input
                  className="form-input" name="title" value={form.title}
                  onChange={handleChange} placeholder="e.g. Sunshine Rooms, DHA Phase 5" required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Room Type *</label>
                <select className="form-select" name="roomType" value={form.roomType} onChange={handleChange}>
                  {ROOM_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Address *</label>
              <input
                className="form-input" name="address" value={form.address}
                onChange={handleChange} placeholder="e.g. House 142, Street 5, Block B" required
              />
            </div>

            <div className="add-row">
              <div className="form-group">
                <label className="form-label">Area / Locality *</label>
                <input
                  className="form-input" name="area" value={form.area}
                  onChange={handleChange} placeholder="e.g. Sector 32, Phase 7, Model Town" required
                />
                <span className="form-hint">Users search by this — be specific</span>
              </div>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input
                  className="form-input" name="city" value={form.city}
                  onChange={handleChange} placeholder="e.g. Lahore" required
                />
              </div>
            </div>

            <div className="add-row">
              <div className="form-group">
                <label className="form-label">Min Rent (Rs/month) *</label>
                <input
                  className="form-input" type="number" name="priceMin"
                  value={form.priceMin} onChange={handleChange}
                  placeholder="e.g. 8000" min={0} required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Max Rent (Rs/month) *</label>
                <input
                  className="form-input" type="number" name="priceMax"
                  value={form.priceMax} onChange={handleChange}
                  placeholder="e.g. 12000" min={0} required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea" name="description" value={form.description}
                onChange={handleChange} rows={4}
                placeholder="Describe the property — furnishings, nearby landmarks, rules, etc."
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Google Maps Embed URL
                <span className="form-hint"> (optional)</span>
              </label>
              <input
                className="form-input" name="locationUrl" value={form.locationUrl}
                onChange={handleChange} placeholder="https://www.google.com/maps/embed?pb=..."
              />
              <span className="form-hint">
                Google Maps → Share → Embed a map → Copy the src="..." URL
              </span>
            </div>
          </div>

          {/* ── Section 2: Amenities ── */}
          <div className="add-section card">
            <h2 className="add-section-title">✅ Amenities</h2>
            <div className="amenities-grid">
              {AMENITIES_LIST.map((a) => (
                <label
                  key={a}
                  className={'amenity-pill' + (form.amenities.includes(a) ? ' selected' : '')}
                >
                  <input
                    type="checkbox"
                    checked={form.amenities.includes(a)}
                    onChange={() => toggleAmenity(a)}
                  />
                  {a}
                </label>
              ))}
            </div>
          </div>

          {/* ── Section 3: Photos ── */}
          <div className="add-section card">
            <h2 className="add-section-title">📷 Photos</h2>

            {/* Existing images in edit mode */}
            {isEdit && existingImages.length > 0 && (
              <div className="existing-images-wrap">
                <p className="existing-images-label">Current Photos</p>
                <div className="image-previews">
                  {existingImages.map((src, i) => (
                    <div key={i} className="img-preview-wrap">
                      <img src={src} alt={`Existing ${i + 1}`} />
                      <button
                        type="button"
                        className="img-remove-btn"
                        onClick={() => removeExistingImage(i)}
                        title="Remove this photo"
                      >
                        ✕
                      </button>
                      {i === 0 && <span className="img-cover-tag">Cover</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload zone */}
            <div className="upload-zone" onClick={() => fileRef.current.click()}>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleNewImages}
                style={{ display: 'none' }}
              />
              <div className="upload-zone-icon">📁</div>
              <div className="upload-zone-text">
                {isEdit ? 'Click to add more photos' : 'Click to select photos'}
              </div>
              <div className="upload-zone-hint">
                Up to {6 - existingImages.length} more &nbsp;·&nbsp; JPG, PNG, WebP &nbsp;·&nbsp; Max 5MB each
              </div>
            </div>

            {/* New image previews */}
            {newPreviews.length > 0 && (
              <div className="image-previews" style={{ marginTop: '0.75rem' }}>
                {newPreviews.map((src, i) => (
                  <div key={i} className="img-preview-wrap">
                    <img src={src} alt={`New ${i + 1}`} />
                    <button
                      type="button"
                      className="img-remove-btn"
                      onClick={() => removeNewImage(i)}
                    >
                      ✕
                    </button>
                    <span className="img-new-tag">New</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Section 4: Owner Details ── */}
          <div className="add-section card">
            <h2 className="add-section-title">👤 Owner Contact</h2>
            <div className="add-row">
              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input
                  className="form-input" name="ownerName" value={form.ownerName}
                  onChange={handleChange} placeholder="Full name of owner" required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Phone *</label>
                <input
                  className="form-input" type="tel" name="ownerPhone" value={form.ownerPhone}
                  onChange={handleChange} placeholder="+92 300 0000000" required
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">
                Owner WhatsApp
                <span className="form-hint"> (optional)</span>
              </label>
              <input
                className="form-input" type="tel" name="ownerWhatsapp"
                value={form.ownerWhatsapp} onChange={handleChange}
                placeholder="+92 300 0000000"
              />
            </div>
          </div>

          {/* ── Submit ── */}
          <div className="add-submit">
            <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading
                ? (isEdit ? 'Saving…' : 'Publishing…')
                : (isEdit ? '💾 Save Changes' : '🚀 Publish Listing')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}