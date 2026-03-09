import { useCallback } from 'react';

export function useApi() {
  const apiFetch = useCallback(async (path, options = {}) => {
    const token = localStorage.getItem('token');

    const res = await fetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    if (res.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired');
    }

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'API error');
    }

    return data;
  }, []);

  return apiFetch;
}
