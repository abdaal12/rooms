import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">

        {/* Top section */}
        <div className="footer-top">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <img src="/logo.png" alt="Nivas24" className="footer-logo-img" />
            </div>
            <p>
              A trusted property listing platform connecting tenants
              with verified rooms across every sector, phase, and locality.
            </p>
            <div className="footer-badge">
              🔒 Safe &nbsp;·&nbsp; 🏡 Verified &nbsp;·&nbsp; 📞 Direct Contact
            </div>
          </div>

          {/* Browse */}
          <div className="footer-col">
            <h4>Browse</h4>
            <Link to="/?roomType=Single%20Room">Single Rooms</Link>
            <Link to="/?roomType=PG">PG / Hostels</Link>
            <Link to="/?roomType=Studio">Studios</Link>
            <Link to="/?roomType=Flat">Flats</Link>
            <Link to="/?roomType=1BHK">1BHK</Link>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>Legal</h4>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/owner-agreement">Owner Agreement</Link>
            <Link to="/guidelines">Listing Guidelines</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h4>Support</h4>
            <Link to="/contact">Contact Us</Link>
            <Link to="/contact">Grievance Redressal</Link>
            <Link to="/guidelines">Report a Problem</Link>
            <Link to="/owner-agreement">List Your Property</Link>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Nivas24. All rights reserved.</p>
          <p className="footer-disclaimer-short">
            Nivas24 is a listing platform only. We do not own, rent, or manage any property.
          </p>
          <div className="footer-legal-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}