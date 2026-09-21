import React, { useState, useEffect, useCallback } from 'react';
import { getProperties } from '../api';
import PropertyCard from '../components/PropertyCard';
import './HomePage.css';

const ROOM_TYPES = [
  'Single Room',
  'Double Room',
  'Studio',
  '1BHK',
  '2BHK',
  '3BHK',
  'PG',
  'Flat',
];

export default function HomePage() {
  const [properties, setProperties]   = useState([]);
  const [total, setTotal]             = useState(0);
  const [totalPages, setTotalPages]   = useState(1);
  const [page, setPage]               = useState(1);
  const [loading, setLoading]         = useState(false);

  // Filters
  const [search, setSearch]     = useState('');
  const [roomType, setRoomType] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(
    async (resetPage = false) => {
      setLoading(true);
      try {
        const pg = resetPage ? 1 : page;
        const { data } = await getProperties({
          search:   search.trim() || undefined,
          roomType: roomType      || undefined,
          maxPrice: maxPrice      || undefined,
          page:     pg,
          limit:    9,
        });
        setProperties(data.properties);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        if (resetPage) setPage(1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [search, roomType, maxPrice, page]
  );

  // Debounce search / filter changes
  useEffect(() => {
    const t = setTimeout(() => fetchProperties(true), 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, roomType, maxPrice]);

  // Page change
  useEffect(() => {
    fetchProperties();
    // eslint-disable-next-line
  }, [page]);

  const clearFilters = () => {
    setSearch('');
    setRoomType('');
    setMaxPrice('');
  };

  const hasFilters = search || roomType || maxPrice;

  return (
    <div className="home-page">

      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          
          <h1 className="hero-title">
            Find Your Perfect<br />
            <span className="hero-highlight">Apartment and Rooms for Rent</span>
          </h1>
          <p className="hero-subtitle">
            Search by area name, sector, phase or locality.
            Contact the owner in one tap — no account needed.
          </p>

          {/* ── Search bar ── */}
          <div className="hero-search">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by area, sector, phase, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              {search && (
                <button
                  className="search-clear"
                  onClick={() => setSearch('')}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">{total}</span>
              <span className="hero-stat-label">Listings</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">0</span>
              <span className="hero-stat-label">Login Required</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-num">1</span>
              <span className="hero-stat-label">Tap to Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          FILTER BAR
      ════════════════════════════════════════ */}
      <div className="filter-bar-wrap">
        <div className="container filter-bar">

          <div className="filter-group">
            <label className="filter-label">Room Type</label>
            <select
              className="form-select filter-select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="">All Types</option>
              {ROOM_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Rent (Rs/mo)</label>
            <input
              className="form-input filter-select"
              type="number"
              placeholder="e.g. 15000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              min={0}
            />
          </div>

          {hasFilters && (
            <button className="btn btn-ghost filter-clear-btn" onClick={clearFilters}>
              ✕ Clear
            </button>
          )}

          <div className="filter-result-count">
            {loading
              ? 'Searching…'
              : `${total} propert${total === 1 ? 'y' : 'ies'} found`}
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════
          PROPERTIES GRID
      ════════════════════════════════════════ */}
      <section className="properties-section">
        <div className="container">

          {loading ? (
            <div className="spinner" />

          ) : properties.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🏚️</span>
              <h3>No properties found</h3>
              <p>
                {hasFilters
                  ? 'Try different search terms or clear the filters.'
                  : 'No listings have been added yet. Check back soon!'}
              </p>
              {hasFilters && (
                <button className="btn btn-outline" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>

          ) : (
            <>
              {/* Active filter tags */}
              {hasFilters && (
                <div className="active-filters">
                  {search && (
                    <span className="filter-tag">
                      🔍 "{search}"
                      <button onClick={() => setSearch('')}>✕</button>
                    </span>
                  )}
                  {roomType && (
                    <span className="filter-tag">
                      🛏 {roomType}
                      <button onClick={() => setRoomType('')}>✕</button>
                    </span>
                  )}
                  {maxPrice && (
                    <span className="filter-tag">
                      💰 Max Rs. {Number(maxPrice).toLocaleString()}
                      <button onClick={() => setMaxPrice('')}>✕</button>
                    </span>
                  )}
                </div>
              )}

              {/* Grid */}
              <div className="properties-grid">
                {properties.map((p) => (
                  <PropertyCard key={p._id} property={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    ← Prev
                  </button>

                  <div className="pagination-pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        className={`page-btn ${pg === page ? 'active' : ''}`}
                        onClick={() => setPage(pg)}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>

                  <button
                    className="btn btn-ghost"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════ */}
      <section className="how-it-works">
        <div className="container">
          <h2 className="hiw-title">How It Works</h2>
          <p className="hiw-sub">Find and contact a room in 3 simple steps</p>
          <div className="hiw-steps">
            <div className="hiw-step">
              <div className="hiw-step-icon">🔍</div>
              <div className="hiw-step-num">01</div>
              <h4>Search Your Area</h4>
              <p>Type your sector, phase, or locality name in the search bar.</p>
            </div>
            <div className="hiw-arrow">→</div>
            <div className="hiw-step">
              <div className="hiw-step-icon">📍</div>
              <div className="hiw-step-num">02</div>
              <h4>View Location</h4>
              <p>Click "View Location" on any property to see it on the map.</p>
            </div>
            <div className="hiw-arrow">→</div>
            <div className="hiw-step">
              <div className="hiw-step-icon">📞</div>
              <div className="hiw-step-num">03</div>
              <h4>Connect Instantly</h4>
              <p>Request a callback or call us directly — we connect you right away.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}