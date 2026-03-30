import axios from 'axios';

// Get API URL from env or fallback
export const API_BASE_URL = (import.meta.env.VITE_API_URL || "https://lstfnd-backendnew.onrender.com") + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout for Render wake-up
  withCredentials: true, // Enable cross-origin credentials if required by backend
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for adding Authorization token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the response for debugging
    console.error("API Connection failure:", error.response);
    
    // Customize error message for UI
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Network Error (CORS or Server Offline)";
    
    // Re-pack error with a more useful message
    const customError = new Error(message);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default api;
