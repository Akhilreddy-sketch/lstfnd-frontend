import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { LogIn, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleIdentifyChange = (e) => {
    setFormData({ ...formData, identifier: e.target.value });
  };
  const handlePassChange = (e) => setFormData({ ...formData, password: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Note: mapping identifier to either email or username could be backend-specific.
      // Assuming backend expects "emailOrUsername" or "username" etc., adjust if needed.
      const payload = {
        emailOrUsername: formData.identifier,
        password: formData.password
      };
      
      const response = await api.post('/api/auth/login', payload);
      // Assuming standard success
      if (response.data && response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user)); // Save user object
        navigate('/status');
      }
    } catch (err) {
      setError(err.message || 'Login failed.');
      console.error("Login component error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className="page-container"
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <div className="form-container">
        <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h2>
        <p className="text-muted mb-6">Sign in to report or track missing items.</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-text mb-4" style={{ padding: '12px', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px' }}>{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Email or Username</label>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Enter email or username" 
              value={formData.identifier}
              onChange={handleIdentifyChange}
              required
            />
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="Enter your password" 
              value={formData.password}
              onChange={handlePassChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : <LogIn size={20} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center mt-6 text-muted">
          Don't have an account? <Link to="/register" className="text-primary" style={{ fontWeight: 600 }}>Create One</Link>
        </p>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
}
