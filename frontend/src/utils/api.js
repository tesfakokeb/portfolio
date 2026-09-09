import axios from 'axios';

/**
 * Normalise VITE_API_URL into a bare origin.
 * Accepts any of these and yields the same result:
 *   https://tesfaworku-back.onrender.com
 *   https://tesfaworku-back.onrender.com/
 *   https://tesfaworku-back.onrender.com/api
 * Without this, a value ending in /api produced requests to /api/api/... .
 * Empty in development, where Vite proxies /api to the Express backend.
 */
const raw = (import.meta.env.VITE_API_URL || '').trim();
export const BACKEND_ORIGIN = raw.replace(/\/+$/, '').replace(/\/api$/i, '');

const baseURL = BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api` : '/api';

export const api = axios.create({
  baseURL,
  // Free hosting tiers spin the backend down when idle; the first request after
  // that has to wait for a cold start, which regularly exceeds 30s. A 10s
  // timeout made every wake-up look like a server error to the user.
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;
