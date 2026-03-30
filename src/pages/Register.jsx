import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api';
import { UserPlus, Loader2 } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await API.post('/api/auth/register', formData);
      if (response.data) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
      console.error("Register component error:", err);
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
        <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>Join Us</h2>
        <p className="text-muted mb-6">Create an account to start reporting items.</p>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-text mb-4" style={{ padding: '12px', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px' }}>{error}</div>}
          
          <div className="input-group">
            <label className="input-label">Username</label>
            <input 
              type="text" 
              name="username"
              className="input-field" 
              placeholder="Choose a username" 
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input 
              type="email" 
              name="email"
              className="input-field" 
              placeholder="Enter your email" 
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Password</label>
            <input 
              type="password" 
              name="password"
              className="input-field" 
              placeholder="Create a password" 
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : <UserPlus size={20} />}
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-muted">
          Already have an account? <Link to="/login" className="text-primary" style={{ fontWeight: 600 }}>Sign In</Link>
        </p>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
}
