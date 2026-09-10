import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { adminLogin, adminRegister } from '../api';
import { useAuth } from '../context/AuthContext';
import './AdminLoginPage.css';

export default function AdminLoginPage() {
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });

  // Already logged in → go to dashboard
  useEffect(() => {
    if (admin) navigate(from, { replace: true });
  }, [admin, navigate, from]);

  // ── Login ──
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await adminLogin(loginForm);
      login(data.token, data.admin);
      toast.success(`Welcome back, ${data.admin.name.split(' ')[0]}!`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // ── Register ──
  const handleRegister = async (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirm) {
      toast.error('Passwords do not match.');
      return;
    }
    if (regForm.password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await adminRegister({
        name: regForm.name,
        email: regForm.email,
        password: regForm.password,
      });
      login(data.token, data.admin);
      toast.success(`Account created! Welcome, ${data.admin.name.split(' ')[0]}!`);
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* Background decoration */}
      <div className="login-bg" />

      <div className="login-card card">

        {/* Header */}
        <div className="login-header">
          <Link to="/" className="login-logo">🏠 RoomRent</Link>
          <h1>Admin Portal</h1>
          <p>Manage your property listings</p>
        </div>

        {/* Tabs */}
        <div className="login-tabs">
          <button
            className={`login-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Sign In
          </button>
          <button
            className={`login-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Create Account
          </button>
        </div>

        {/* ── Login Form ── */}
        {tab === 'login' && (
          <form className="login-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, email: e.target.value }))
                }
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                type="password"
                placeholder="Enter your password"
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm((f) => ({ ...f, password: e.target.value }))
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-navy btn-full login-submit"
              disabled={loading}
            >
              {loading ? 'Signing in…' : '🔑 Sign In'}
            </button>

            <p className="login-switch">
              No account yet?{' '}
              <button
                type="button"
                className="switch-link"
                onClick={() => setTab('register')}
              >
                Create one
              </button>
            </p>
          </form>
        )}

        {/* ── Register Form ── */}
        {tab === 'register' && (
          <form className="login-form" onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="Your full name"
                value={regForm.name}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, name: e.target.value }))
                }
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="admin@example.com"
                value={regForm.email}
                onChange={(e) =>
                  setRegForm((f) => ({ ...f, email: e.target.value }))
                }
                required
              />
            </div>

            <div className="login-row">
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Min 6 characters"
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input
                  className="form-input"
                  type="password"
                  placeholder="Repeat password"
                  value={regForm.confirm}
                  onChange={(e) =>
                    setRegForm((f) => ({ ...f, confirm: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-navy btn-full login-submit"
              disabled={loading}
            >
              {loading ? 'Creating account…' : '🚀 Create Admin Account'}
            </button>

            <p className="login-switch">
              Already have an account?{' '}
              <button
                type="button"
                className="switch-link"
                onClick={() => setTab('login')}
              >
                Sign in
              </button>
            </p>
          </form>
        )}

        {/* Footer note */}
        <div className="login-footer">
          <Link to="/">← Back to browsing rooms</Link>
        </div>

      </div>
    </div>
  );
}