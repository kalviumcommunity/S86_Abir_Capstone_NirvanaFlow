export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    // Running in browser - use the current origin
    return window.location.origin;
  }
  // Running on server - use environment variable or default
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'https://nirvanaflow.vercel.app';
}

// Create axios instance with dynamic base URL
import axios from 'axios';

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

export default api;