import axios from 'axios';

// Get API URL from env or fallback to provided Render URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://lstfnd-backendnew.onrender.com";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for better error handling as requested
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the response for debugging as requested
    console.error("API Error Response:", error.response);
    
    // Customize error message for show in UI
    const message = error.response?.data?.message || error.response?.data?.error || error.message || "Network Error";
    
    // Re-pack error with a more useful message
    const customError = new Error(message);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default api;
