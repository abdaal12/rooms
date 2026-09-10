import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  getAllProperties,
  deleteProperty,
  toggleAvailability,
  getLeads,
  updateLeadStatus,
} from '../api';
import { useAuth } from '../context/AuthContext';
import './AdminDashboard.css';


export default function AdminDashboard() {
  const { admin } = useAuth();
  const [tab, setTab]           = useState('properties');
  const [properties, setProperties] = useState([]);
  const [leads, setLeads]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [deleteId, setDeleteId]     = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [propRes, leadRes] = await Promise.all([
          getAllProperties(),
          getLeads(),
        ]);
        setProperties(propRes.data.properties);
        setLeads(leadRes.data);
      } catch (err) {
        toast.error('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── Toggle Availability ───────────────────────────────────────────────────
  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      const { data } = await toggleAvailability(id);
      setProperties((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isAvailable: data.isAvailable } : p
        )
      );
      toast.success(
        data.isAvailable
          ? '✅ Property marked as Available'
          : '🔴 Property marked as Unavailable'
      );
    } catch {
      toast.error('Failed to update availability.');
    } finally {
      setTogglingId(null);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success('Property deleted.');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete property.');
    }
  };

  // ── Lead status ───────────────────────────────────────────────────────────
  const handleLeadStatus = async (id, status) => {
    try {
      await updateLeadStatus(id, status);
      setLeads((prev) =>
        prev.map((l) => (l._id === id ? { ...l, status } : l))
      );
      toast.success('Lead status updated.');
    } catch {
      toast.error('Failed to update status.');
    }
  };

  // ── Counts ────────────────────────────────────────────────────────────────
  const newLeads        = leads.filter((l) => l.status === 'new').length;
  const urgentLeads     = leads.filter((l) => l.type === 'urgent').length;
  const callbackLeads   = leads.filter((l) => l.type === 'callback').length;
  const availableCount  = properties.filter((p) => p.isAvailable).length;
  const unavailableCount = properties.filter((p) => !p.isAvailable).length;

  return (
    <div className="dashboard-page">
      <div className="container">

        {/* Header */}
        <div className="dash-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p>Welcome back, <strong>{admin?.name}</strong></p>
          </div>
          <Link to="/admin/add" className="btn btn-primary btn-lg">
            + Add Property
          </Link>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="stat-card">
            <div className="stat-icon">🏠</div>
            <div className="stat-info">
              <span className="stat-num">{properties.length}</span>
              <span className="stat-label">Total Properties</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-num">{availableCount}</span>
              <span className="stat-label">Available</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔴</div>
            <div className="stat-info">
              <span className="stat-num">{unavailableCount}</span>
              <span className="stat-label">Unavailable</span>
            </div>
          </div>
          <div className={`stat-card ${urgentLeads > 0 ? 'stat-card-urgent' : ''}`}>
            <div className="stat-icon">📞</div>
            <div className="stat-info">
              <span className="stat-num">{urgentLeads}</span>
              <span className="stat-label">Urgent Calls</span>
            </div>
          </div>
          <div className={`stat-card ${newLeads > 0 ? 'stat-card-new' : ''}`}>
            <div className="stat-icon">🔔</div>
            <div className="stat-info">
              <span className="stat-num">{newLeads}</span>
              <span className="stat-label">New Leads</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <span className="stat-num">{callbackLeads}</span>
              <span className="stat-label">Callbacks</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="dash-tabs">
          <button
            className={'dash-tab' + (tab === 'properties' ? ' active' : '')}
            onClick={() => setTab('properties')}
          >
            🏠 Properties
            <span className="dash-tab-count">{properties.length}</span>
          </button>
          <button
            className={'dash-tab' + (tab === 'leads' ? ' active' : '')}
            onClick={() => setTab('leads')}
          >
            📨 Leads
            {newLeads > 0 && (
              <span className="dash-tab-badge">{newLeads}</span>
            )}
          </button>
        </div>

        {/* ════════════════════════════
            PROPERTIES TAB
        ════════════════════════════ */}
        {loading ? (
          <div className="spinner" />
        ) : tab === 'properties' ? (
          <div className="dash-properties">
            {properties.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🏚️</span>
                <h3>No properties yet</h3>
                <p>Add your first property listing.</p>
                <Link to="/admin/add" className="btn btn-primary">+ Add Property</Link>
              </div>
            ) : (
              properties.map((p) => (
                <div
                  key={p._id}
                  className={'dash-prop-row card' + (!p.isAvailable ? ' dash-prop-unavailable' : '')}
                >
                  {/* Thumbnail */}
                  <div className="dash-prop-thumb">
                    {p.images && p.images[0] ? (
                      <img src={p.images[0]} alt={p.title} />
                    ) : (
                      <div className="dash-prop-placeholder">🏠</div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="dash-prop-info">
                    <div className="dash-prop-title">{p.title}</div>
                    <div className="dash-prop-meta">
                      <span>📍 {p.area}, {p.city}</span>
                      <span>🛏 {p.roomType}</span>
                      <span className="dash-prop-price">
                        Rs. {(p.priceMin || 0).toLocaleString()} – {(p.priceMax || 0).toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="dash-prop-bottom">
                      <span className={'badge ' + (p.isAvailable ? 'badge-green' : 'badge-red')}>
                        {p.isAvailable ? '✅ Available' : '🔴 Unavailable'}
                      </span>
                      <span className="dash-prop-leads">
                        {leads.filter((l) => l.property && l.property._id === p._id).length} leads
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="dash-prop-actions">
                    {/* Toggle availability */}
                    <button
                      className={'btn btn-sm ' + (p.isAvailable ? 'btn-toggle-off' : 'btn-toggle-on')}
                      onClick={() => handleToggle(p._id)}
                      disabled={togglingId === p._id}
                      title={p.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                    >
                      {togglingId === p._id
                        ? '…'
                        : p.isAvailable
                        ? '🔴 Mark Unavailable'
                        : '✅ Mark Available'}
                    </button>

                    {/* Edit */}
                    <Link
                      to={`/admin/edit/${p._id}`}
                      className="btn btn-outline btn-sm"
                    >
                      ✏️ Edit
                    </Link>

                    {/* Delete */}
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => setDeleteId(p._id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        ) : (
        /* ════════════════════════════
            LEADS TAB
        ════════════════════════════ */
          <div className="dash-leads">
            {leads.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <h3>No leads yet</h3>
                <p>Leads from users will appear here.</p>
              </div>
            ) : (
              leads.map((lead) => (
                <div
                  key={lead._id}
                  className={'lead-card card' + (lead.type === 'urgent' ? ' lead-urgent' : '')}
                >
                  <div className="lead-top">
                    <div className="lead-type-wrap">
                      <span className={'badge ' + (lead.type === 'urgent' ? 'badge-red' : 'badge-navy')}>
                        {lead.type === 'urgent' ? '📞 Urgent Call' : '📋 Callback'}
                      </span>
                      {lead.type === 'urgent' && (
                        <span className="lead-urgent-note">User called admin number directly</span>
                      )}
                    </div>
                    <span className="lead-time">
                      {new Date(lead.createdAt).toLocaleString('en-PK', {
                        day: 'numeric', month: 'short',
                        year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="lead-body">
                    <div className="lead-user">
                      <div className="lead-avatar">
                        {lead.name ? lead.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="lead-user-info">
                        <div className="lead-name">{lead.name}</div>
                        <div className="lead-contacts">
                          <a href={`tel:${lead.phone}`} className="lead-contact-link lead-phone">
                            📞 {lead.phone}
                          </a>
                          {lead.whatsapp && (
                            <a
                              href={`https://wa.me/${lead.whatsapp}`}
                              target="_blank"
                              rel="noreferrer"
                              className="lead-contact-link lead-wa"
                            >
                              💬 WhatsApp
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {lead.property && (
                      <div className="lead-property">
                        <span>🏠</span>
                        <div>
                          <div className="lead-prop-title">{lead.property.title}</div>
                          <div className="lead-prop-loc">
                            {lead.property.area}, {lead.property.city}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lead-footer">
                    <select
                      className="lead-status-select"
                      value={lead.status}
                      onChange={(e) => handleLeadStatus(lead._id, e.target.value)}
                    >
                      <option value="new">🔵 New</option>
                      <option value="contacted">🟡 Contacted</option>
                      <option value="done">🟢 Done</option>
                    </select>
                    <div className="lead-action-btns">
                      <a href={`tel:${lead.phone}`} className="btn btn-navy btn-sm">
                        📞 Call
                      </a>
                      <a
                        href={`https://wa.me/${lead.whatsapp || lead.phone}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-green btn-sm"
                      >
                        💬 WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">⚠️</div>
            <h3>Delete Property?</h3>
            <p>This action cannot be undone. The listing will be permanently removed.</p>
            <div className="delete-modal-actions">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}