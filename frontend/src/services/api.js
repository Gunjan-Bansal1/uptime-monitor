import axios from 'axios';

// API base URL configuration (uses environment variable with a default fallback to 127.0.0.1:8000)
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Fetch all monitored URLs and their latest health checks.
 */
export const getUrls = () => {
  return api.get('/urls');
};

/**
 * Register a new URL for health check monitoring.
 * @param {string} url - The URL string to register (e.g., 'https://example.com')
 */
export const registerUrl = (url) => {
  return api.post('/urls', { url });
};

/**
 * Delete a monitored URL by its ID.
 * @param {number|string} id - The ID of the URL record to delete
 */
export const deleteUrl = (id) => {
  return api.delete(`/urls/${id}`);
};

export default api;
