import axios from 'axios';

// In development, Vite proxies /api to the Express backend (see vite.config.js).
// In production, set VITE_API_URL to the deployed backend origin.
const baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
