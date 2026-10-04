import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import './Navbar.css';

export default function Navbar() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const close = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully.');
    navigate('/');
    close();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={close}>
          <span className="brand-icon">🏠</span>
          <span className="brand-name">
            Nivas<span>24</span>
          </span>
        </Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>

        {/* Links */}
        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>

          {/* Always visible */}
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={close}
          >
            Browse Rooms
          </Link>

          {admin ? (
            <>
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                onClick={close}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/add"
                className={`nav-link ${isActive('/admin/add') ? 'active' : ''}`}
                onClick={close}
              >
                + Add Property
              </Link>

              {/* Admin info + logout */}
              <div className="navbar-admin">
                <div className="admin-avatar">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <span className="admin-name">{admin.name}</span>
                <button className="btn btn-sm btn-ghost logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </>
          ) : (
            /* Visitor only sees this */
            <Link to="/admin/login" className="nav-login-btn" onClick={close}>
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}