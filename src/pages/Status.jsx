import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../api';
import { RefreshCw, MapPin, Clock, Info, Phone, Trash2 } from 'lucide-react';

export default function Status() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await API.get('/api/items');
      setItems(response.data || []);
    } catch (err) {
      setError(err.message || 'Error fetching status. Is the backend running?');
      console.error("Status fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await API.delete(`/api/items/${id}`);
      setItems(items.filter(item => (item.id || item.index) !== id));
      alert('Item deleted successfully');
    } catch (err) {
      alert('Failed to delete item: ' + (err.response?.data?.error || err.message));
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-container"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Item Status</h1>
          <p className="text-muted">Check the latest reported lost and found items.</p>
        </div>
        
        <button className="btn btn-outline" onClick={fetchItems} disabled={loading} style={{ padding: '10px 20px' }}>
          <RefreshCw size={18} className={loading ? 'spin' : ''} />
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </button>
      </div>

      {error ? (
        <div className="error-text" style={{ padding: '16px', background: 'rgba(255, 77, 79, 0.1)', borderRadius: '12px', fontSize: '1rem' }}>
          <strong>Failed to load items:</strong> {error}
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <RefreshCw className="spin text-primary" size={40} />
        </div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
          <Info size={40} className="text-muted mb-4" style={{ margin: '0 auto' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>No items reported yet</h3>
          <p className="text-muted">Once someone reports a lost or found item, it will appear here.</p>
        </div>
      ) : (
        <motion.div 
          className="items-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {items.map((item, index) => (
            <motion.div 
              key={item.id || index}
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              style={{
                backgroundColor: 'var(--surface-color)',
                borderRadius: '16px',
                border: '1px solid var(--border-color)',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: '0 8px 16px rgba(0,0,0,0.2)'
              }}
            >
              {/* Top Banner based on type */}
              <div style={{
                height: '6px',
                background: item.type === 'Lost' ? '#ff4d4f' : '#52c41a' // Orange/Red if lost, Green if found
              }} />
              
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 600, maxWidth: '70%' }}>{item.itemName}</h3>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    color: item.type === 'Lost' ? '#ff4d4f' : '#52c41a',
                    backgroundColor: item.type === 'Lost' ? 'rgba(255, 77, 79, 0.1)' : 'rgba(82, 196, 26, 0.1)'
                  }}>
                    {item.type}
                  </span>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <MapPin size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span className="text-muted">{item.place}</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <Clock size={18} className="text-primary" style={{ marginTop: '2px', flexShrink: 0 }} />
                    <span className="text-muted">
                      {item.time ? new Date(item.time).toLocaleString() : 'Time not reported'}
                    </span>
                  </div>
                  
                  {(item.color || item.material) && (
                    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '16px' }}>
                      {item.color && (
                        <div>
                          <span style={{ fontSize: '0.8rem', color: '#777', display: 'block' }}>Color</span>
                          <span style={{ fontWeight: 500 }}>{item.color}</span>
                        </div>
                      )}
                      {item.material && (
                         <div>
                          <span style={{ fontSize: '0.8rem', color: '#777', display: 'block' }}>Material</span>
                          <span style={{ fontWeight: 500 }}>{item.material}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {item.phoneNumber && (
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
                      <a
                        href={`tel:${item.phoneNumber}`}
                        className="btn"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: 'linear-gradient(135deg, #52c41a, #389e0d)',
                          color: '#fff',
                          borderRadius: '10px',
                          fontWeight: 600,
                          fontSize: '0.9rem',
                          textDecoration: 'none',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: '0 4px 12px rgba(82, 196, 26, 0.3)',
                          width: '100%',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(82, 196, 26, 0.45)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(82, 196, 26, 0.3)';
                        }}
                      >
                        <Phone size={18} />
                        Call: {item.phoneNumber}
                      </a>
                    </div>
                  )}

                  {/* Admin Delete Button */}
                  {user && user.role === 'ADMIN' && (
                    <div style={{ marginTop: '10px' }}>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="btn"
                        style={{
                          width: '100%',
                          padding: '10px 20px',
                          background: 'rgba(255, 77, 79, 0.1)',
                          color: '#ff4d4f',
                          border: '1px solid rgba(255, 77, 79, 0.3)',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          justifyContent: 'center',
                          fontWeight: 600,
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = 'rgba(255, 77, 79, 0.2)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = 'rgba(255, 77, 79, 0.1)';
                        }}
                      >
                        <Trash2 size={18} />
                        Delete Item (Admin)
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; }
      `}</style>
    </motion.div>
  );
}
