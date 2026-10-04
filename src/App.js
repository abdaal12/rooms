import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/ProtectedRoute';
import Navbar             from './components/Navbar';
import Footer             from './components/Footer';

import HomePage           from './pages/HomePage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AdminLoginPage     from './pages/AdminLoginPage';
import AdminDashboard     from './pages/AdminDashboard';
import AddPropertyPage    from './pages/AddPropertyPage';

import {
  TermsPage,
  PrivacyPage,
  OwnerAgreementPage,
  GuidelinesPage,
  DisclaimerPage,
  ContactPage,
} from './pages/LegalPages';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '0.9rem' },
          }}
        />
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 64px)' }}>
          <Routes>
            {/* Public */}
            <Route path="/"                  element={<HomePage />} />
            <Route path="/property/:id"      element={<PropertyDetailPage />} />
            <Route path="/admin/login"       element={<AdminLoginPage />} />

            {/* Legal */}
            <Route path="/terms"             element={<TermsPage />} />
            <Route path="/privacy"           element={<PrivacyPage />} />
            <Route path="/owner-agreement"   element={<OwnerAgreementPage />} />
            <Route path="/guidelines"        element={<GuidelinesPage />} />
            <Route path="/disclaimer"        element={<DisclaimerPage />} />
            <Route path="/contact"           element={<ContactPage />} />

            {/* Admin only */}
            <Route path="/admin" element={
              <ProtectedRoute><AdminDashboard /></ProtectedRoute>
            } />
            <Route path="/admin/add" element={
              <ProtectedRoute><AddPropertyPage /></ProtectedRoute>
            } />
            <Route path="/admin/edit/:id" element={
              <ProtectedRoute><AddPropertyPage /></ProtectedRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}