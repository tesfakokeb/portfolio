// ─── Centralised Backend URL Helper ────────────────────────────────────────────
// In development Vite proxies /api → http://localhost:5000, so the origin is ''.
// In production VITE_API_URL points to the deployed backend origin
// (e.g. "https://tesfaworku-back.onrender.com").
//
// The value is normalised so a trailing slash or a trailing "/api" in the env
// var cannot produce a doubled path like ".../api/api/certificates".

const raw = (import.meta.env.VITE_API_URL || '').trim();

/** Full backend origin — empty string during local dev. */
export const BACKEND_ORIGIN = raw.replace(/\/+$/, '').replace(/\/api$/i, '');

/** Base path for API endpoints (e.g. "https://…/api" or "/api"). */
export const API_BASE = BACKEND_ORIGIN ? `${BACKEND_ORIGIN}/api` : '/api';

/**
 * Resolve a file URL that may be either:
 *   - A full Cloudinary URL (https://res.cloudinary.com/...)  → return as-is
 *   - A relative local path  (/uploads/avatars/...)           → prepend BACKEND_ORIGIN
 *   - null / undefined                                         → return null
 */
export function resolveFileUrl(url) {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${BACKEND_ORIGIN}${url}`;
}
