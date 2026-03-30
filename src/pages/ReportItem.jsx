import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { Send, Loader2 } from 'lucide-react';

export default function ReportItem() {
  const { type } = useParams(); // gets 'lost' or 'found' from URL /report/lost
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    itemName: '',
    material: '',
    color: '',
    place: '',
    time: '',
    phoneNumber: '',
    type: type === 'found' ? 'Found' : 'Lost'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Keeps the form in sync if user changes URL between /report/lost and /report/found
  useEffect(() => {
    if (type) {
      setFormData(prev => ({ ...prev, type: type === 'found' ? 'Found' : 'Lost' }));
    }
  }, [type]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await API.post('/api/items', formData);
      setSuccess('Item reported successfully!');
      setTimeout(() => navigate('/status'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to report item.');
      console.error("Report item error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      <div className="form-container" style={{ maxWidth: '600px' }}>
        <h2 className="mb-2" style={{ fontSize: '2rem', fontWeight: 700 }}>
          Report <span className="text-primary">{formData.type}</span> Item
        </h2>
        <p className="text-muted mb-6">
          Provide detailed information so it can be verified easily.
        </p>

        {error && <div className="error-text mb-4" style={{ padding: '12px', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '8px' }}>{error}</div>}
        {success && <div className="mb-4" style={{ color: '#52c41a', padding: '12px', background: 'rgba(82, 196, 26, 0.1)', borderRadius: '8px', fontWeight: 500 }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Item Name</label>
            <input name="itemName" className="input-field" placeholder="E.g., iPhone 13 Pro" value={formData.itemName} onChange={handleChange} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="input-group">
              <label className="input-label">Material</label>
              <input name="material" className="input-field" placeholder="E.g., Leather, Glass" value={formData.material} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label">Color</label>
              <input name="color" className="input-field" placeholder="E.g., Black" value={formData.color} onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Place {formData.type === 'Lost' ? 'Lost' : 'Found'}</label>
            <input name="place" className="input-field" placeholder="E.g., Library 2nd Floor, Main Bus Stop" value={formData.place} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Time</label>
            <input name="time" type="datetime-local" className="input-field" value={formData.time} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input name="phoneNumber" type="tel" className="input-field" placeholder="E.g., +91 9876543210" value={formData.phoneNumber} onChange={handleChange} required />
          </div>

          <div className="input-group mb-6">
            <label className="input-label">Type</label>
            <select name="type" className="input-field" value={formData.type} onChange={handleChange} required>
              <option value="Lost">Lost</option>
              <option value="Found">Found</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <Loader2 className="spin" size={20} /> : <Send size={20} />}
            {loading ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
        
        /* Ensure dark theme for datetime picker */
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          filter: invert(0.8);
          cursor: pointer;
        }
      `}</style>
    </motion.div>
  );
}
