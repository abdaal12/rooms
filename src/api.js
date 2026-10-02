import axios from 'axios';

const API = axios.create({
 baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach admin JWT token to every request if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export const adminLogin    = (data) => API.post('/auth/login', data);
export const adminRegister = (data) => API.post('/auth/register', data);
export const getMe         = ()     => API.get('/auth/me');

// ── Properties (public) ───────────────────────────────────────────────────────
export const getProperties = (params) => API.get('/properties', { params });
export const getProperty   = (id)     => API.get(`/properties/${id}`);

// ── Properties (admin only) ───────────────────────────────────────────────────
export const getAllProperties  = ()           => API.get('/properties/all');
export const createProperty    = (formData)   =>
  API.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProperty    = (id, formData) =>
  API.put(`/properties/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const toggleAvailability = (id)        => API.patch(`/properties/${id}/availability`);
export const deleteProperty    = (id)         => API.delete(`/properties/${id}`);

// ── Leads ─────────────────────────────────────────────────────────────────────
export const submitLead       = (data)        => API.post('/leads', data);
export const getLeads         = ()            => API.get('/leads');
export const updateLeadStatus = (id, status)  => API.patch(`/leads/${id}/status`, { status });

export default API;
