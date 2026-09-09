import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { BACKEND_ORIGIN } from '../utils/apiBase';

export function useApi() {
  const { token, logout } = useAuth();

  const fetchWithAuth = useCallback(
    async (url, options = {}) => {
      const headers = new Headers(options.headers);
      
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      
      if (!(options.body instanceof FormData)) {
        headers.set('Content-Type', 'application/json');
      }

      const response = await fetch(`${BACKEND_ORIGIN}${url}`, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        // Token expired or invalid
        logout();
        throw new Error('Session expired. Please log in again.');
      }

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || 'Something went wrong');
      }

      return data;
    },
    [token, logout]
  );

  return fetchWithAuth;
}
