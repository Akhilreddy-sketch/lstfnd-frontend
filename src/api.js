import axios from 'axios';

// Centralized API Configuration following your exact requirements
export const API_BASE_URL = "https://lstfnd-backendnew.onrender.com";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true, // Matches your backend requirements
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Automatically add JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Fixes the "undefined" error responses by ensuring a message exists
    const message = error.response?.data?.message || 
                    error.response?.data?.error || 
                    error.message || 
                    "Network Error (Check CORS or Server)";
    
    console.error("API Error:", message);
    
    const customError = new Error(message);
    customError.response = error.response;
    return Promise.reject(customError);
  }
);

export default API;
