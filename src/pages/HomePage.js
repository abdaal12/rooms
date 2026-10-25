import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../api';
import PropertyCard from '../components/PropertyCard';
import './HomePage.css';

// ── Slide data ────────────────────────────────────────────────────────────────
const SLIDES = [
  {
    id:    1,
    image: 'images/slides/2.jpg',
    tag:   'Verified Listings',
    title: ['Find Your Perfect', 'Room for Rent'],
    sub:   'Search by area, sector, phase or locality — no login needed',
  },
  {
    id:    2,
    image: 'images/slides/1.jpg',
    tag:   'PG & Hostels',
    title: ['Affordable PGs', 'Near You'],
    sub:   'Fully furnished rooms with WiFi, meals and security',
  },
  {
    id:    3,
    image: 'images/slides/5.jpg',
    tag:   'Modern Studios',
    title: ['Compact Studios', 'For Professionals'],
    sub:   'Self-contained units close to offices and IT parks',
  },
  {
    id:    4,
    image: 'images/slides/6.jpg',
    tag:   'Family Flats',
    title: ['Spacious Flats', 'For Families'],
    sub:   '1BHK, 2BHK & 3BHK options across all major localities',
  },
];

// ── Categories ────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Rooms',       icon: '🛏️', type: 'Single Room'  },
  { label: 'PG',          icon: '🏠', type: 'PG'           },
  { label: 'Studio',      icon: '🏢', type: 'Studio'       },
  { label: '1BHK',        icon: '🛋️', type: '1BHK'         },
  { label: '2BHK',        icon: '🏡', type: '2BHK'         },
  { label: '3BHK',        icon: '🏗️', type: '3BHK'         },
  { label: 'Flat',        icon: '🏘️', type: 'Flat'         },
  { label: 'Double Room', icon: '🛎️', type: 'Double Room'  },
];

// ── Hardcoded properties — show instantly while Render wakes up ───────────────
const HARDCODED_PROPERTIES = [
  {
    _id:         'hc-1',
    title:       'Sunshine PG — Phase 7, Mohali',
    address:     'Street 15, Block D, Phase 7',
    area:        'Phase 7',
    city:        'Mohali',
    priceMin:    6000,
    priceMax:    9000,
    roomType:    'PG',
    images:      ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80'],
    amenities:   ['WiFi', 'AC', 'Furnished'],
    isAvailable: true,
    isHardcoded: true,
  },
  {
    _id:         'hc-2',
    title:       'Modern Studio — Sector 62, Mohali',
    address:     'IT Park Road, Sector 62',
    area:        'Sector 62',
    city:        'Mohali',
    priceMin:    12000,
    priceMax:    16000,
    roomType:    'Studio',
    images:      ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80'],
    amenities:   ['WiFi', 'Parking', 'Kitchen'],
    isAvailable: true,
    isHardcoded: true,
  },
  {
    _id:         'hc-3',
    title:       'Affordable Room — Sector 20, Panchkula',
    address:     'Block H, Sector 20',
    area:        'Sector 20',
    city:        'Panchkula',
    priceMin:    5000,
    priceMax:    7000,
    roomType:    'Single Room',
    images:      ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&q=80'],
    amenities:   ['WiFi', 'Geyser', 'Security Guard'],
    isAvailable: true,
    isHardcoded: true,
  },
];

const ROOM_TYPES = CATEGORIES.map(c => c.type);

export default function HomePage() {
  const navigate = useNavigate();

  // Slider state
  const [activeSlide,  setActiveSlide]  = useState(0);
  const sliderTimer                     = useRef(null);

  // Filter state
  const [search,    setSearch]    = useState('');
  const [roomType,  setRoomType]  = useState('');
  const [maxPrice,  setMaxPrice]  = useState('');

  // Properties state
  const [dbProperties, setDbProperties] = useState([]);
  const [total,        setTotal]        = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [page,         setPage]         = useState(1);
  const [dbLoading,    setDbLoading]    = useState(true);

  // ── Slider auto play ────────────────────────────────────────────────────────
  const goToSlide = (index) => {
    setActiveSlide((index + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    sliderTimer.current = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, 3500);
    return () => clearInterval(sliderTimer.current);
  }, []);

  // ── Fetch from backend ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    setDbLoading(true);

    const timer = setTimeout(async () => {
      try {
        const params = { page, limit: 9 };
        if (search.trim()) params.search   = search.trim();
        if (roomType)       params.roomType = roomType;
        if (maxPrice)       params.maxPrice = maxPrice;

        const { data } = await getProperties(params);
        if (!cancelled) {
          setDbProperties(data.properties);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setDbLoading(false);
      }
    }, 350);

    return () => { cancelled = true; clearTimeout(timer); };
  }, [search, roomType, maxPrice, page]);

  // ── Merge hardcoded + DB (deduplicate by _id) ───────────────────────────────
  const allProperties = React.useMemo(() => {
    if (search || roomType || maxPrice) {
      // When filtering, only show DB results
      return dbProperties;
    }
    // Merge: hardcoded first, then DB (excluding any that share _id)
    const dbIds = new Set(dbProperties.map(p => p._id));
    const uniqueHardcoded = HARDCODED_PROPERTIES.filter(p => !dbIds.has(p._id));
    return [...uniqueHardcoded, ...dbProperties];
  }, [dbProperties, search, roomType, maxPrice]);

  const clearFilters = () => {
    setSearch(''); setRoomType(''); setMaxPrice(''); setPage(1);
  };

  const hasFilters = search || roomType || maxPrice;
  const slide      = SLIDES[activeSlide];

  return (
    <div className="home-page">

      {/* ════════════════════════════════════════
          HERO SLIDER
      ════════════════════════════════════════ */}
      <section className="hero-slider" aria-label="Property listings in Mohali, Chandigarh, Panchkula">

        {/* Slide backgrounds */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={'slide-bg' + (i === activeSlide ? ' active' : '')}
            style={{ backgroundImage: `url(${s.image})` }}
          />
        ))}
        <div className="slide-overlay" />

        {/* Content */}
        <div className="slide-content container">
          <span className="slide-tag">{slide.tag}</span>
          <h1 className="slide-title">
            {slide.title[0]}<br />
            <span className="slide-title-highlight">{slide.title[1]}</span>
          </h1>
          <p className="slide-sub">{slide.sub}</p>

          {/* Search */}
          <div className="hero-search">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Search by area, sector, phase or city…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                aria-label="Search properties"
              />
              {search && (
                <button className="search-clear" onClick={() => setSearch('')}>✕</button>
              )}
            </div>
          </div>

          {/* Dots */}
          <div className="slide-dots">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                className={'slide-dot' + (i === activeSlide ? ' active' : '')}
                onClick={() => goToSlide(i)}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Arrows */}
        <button className="slide-arrow slide-arrow-left"  onClick={() => goToSlide(activeSlide - 1)}>‹</button>
        <button className="slide-arrow slide-arrow-right" onClick={() => goToSlide(activeSlide + 1)}>›</button>

      </section>

      {/* ════════════════════════════════════════
          CATEGORY CIRCLES
      ════════════════════════════════════════ */}
      <section className="cat-section" aria-label="Browse by room type">
        <div className="container">
          <h2 className="cat-heading">Browse by Category</h2>
          <div className="cat-row">
            {CATEGORIES.map((cat) => {
              const isActive = roomType === cat.type;
              return (
                <button
                  key={cat.type}
                  className={'cat-item' + (isActive ? ' active' : '')}
                  onClick={() => { setRoomType(isActive ? '' : cat.type); setPage(1); }}
                  aria-label={`Browse ${cat.label}`}
                >
                  <div className="cat-circle">
                    <span className="cat-icon">{cat.icon}</span>
                  </div>
                  <span className="cat-label">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROPERTIES
      ════════════════════════════════════════ */}
      <section className="props-section">
        <div className="container">

          {/* Header */}
          <div className="props-header">
            <div>
            <h2 className="props-title">
  {roomType
    ? `${roomType}s for Rent`
    : search
    ? `Results for "${search}"`
    : 'Available Properties Near You'}
</h2>
              <p className="props-count">
                {dbLoading && allProperties.length === 0
                  ? 'Loading properties…'
                  : dbLoading
                  ? `${allProperties.length} shown — loading more…`
                  : `${total + HARDCODED_PROPERTIES.length} propert${total === 1 ? 'y' : 'ies'} available`}
              </p>
            </div>
            {hasFilters && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                ✕ Clear Filters
              </button>
            )}
          </div>

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

          {/* Loading bar */}
          {dbLoading && (
            <div className="db-loading-bar">
              <div className="db-loading-inner" />
            </div>
          )}

          {/* Grid */}
          {allProperties.length === 0 && !dbLoading ? (
            <div className="empty-state">
              <span className="empty-icon">🏚️</span>
              <h3>No properties found</h3>
              <p>Try a different area name or clear the filters.</p>
              {hasFilters && (
                <button className="btn btn-outline" onClick={clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="properties-grid">
              {allProperties.map((p) => (
                <PropertyCard key={p._id} property={p} />
              ))}
            </div>
          )}

          {/* Pagination — only for DB results */}
          {!hasFilters && totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-ghost"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <div className="pagination-pages">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pg => (
                  <button
                    key={pg}
                    className={'page-btn' + (pg === page ? ' active' : '')}
                    onClick={() => setPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
              </div>
              <button
                className="btn btn-ghost"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </section>

      {/* ════════════════════════════════════════
          SEO CITY LINKS SECTION
          (helps Google rank for city searches)
      ════════════════════════════════════════ */}
      <section className="seo-section">
        <div className="container">
          <h2 className="seo-title">
            Rooms & PG for Rent — Mohali, Chandigarh, Panchkula
          </h2>
          <p className="seo-desc">
            Nivas24 helps you find verified rooms, paying guest accommodations,
            studios and flats for rent across the Tricity region. Browse listings
            in Mohali sectors like Phase 7, Phase 10, Sector 62, Sector 70,
            Aerocity and more. Find rooms in Chandigarh sectors including
            Sector 17, Sector 22, Sector 34, Sector 47 and Industrial Area.
            Explore PG options in Panchkula sectors like Sector 10, Sector 15,
            Sector 20 and MDC Sector 5.
          </p>
          <div className="seo-city-links">
            <div className="seo-city-group">
              <h3>Rooms in Mohali</h3>
              <div className="seo-links">
                {['Phase 7', 'Phase 10', 'Phase 11', 'Sector 62', 'Sector 70', 'Aerocity', 'Kharar'].map(area => (
                  <button
                    key={area}
                    className="seo-link"
                    onClick={() => { setSearch(area); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Rooms in {area}
                  </button>
                ))}
              </div>
            </div>
            <div className="seo-city-group">
              <h3>Rooms in Chandigarh</h3>
              <div className="seo-links">
                {['Sector 17', 'Sector 22', 'Sector 34', 'Sector 47', 'Industrial Area', 'Manimajra'].map(area => (
                  <button
                    key={area}
                    className="seo-link"
                    onClick={() => { setSearch(area); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Rooms in {area}
                  </button>
                ))}
              </div>
            </div>
            <div className="seo-city-group">
              <h3>Rooms in Panchkula</h3>
              <div className="seo-links">
                {['Sector 10', 'Sector 15', 'Sector 20', 'MDC Sector 5', 'Sector 11', 'Sector 25'].map(area => (
                  <button
                    key={area}
                    className="seo-link"
                    onClick={() => { setSearch(area); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  >
                    Rooms in {area}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}