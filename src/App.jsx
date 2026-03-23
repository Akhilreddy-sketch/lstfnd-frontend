import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, ChevronLeft, User, LogOut, Shield } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ReportItem from './pages/ReportItem';
import Status from './pages/Status';

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report/:type" element={<ReportItem />} />
        <Route path="/status" element={<Status />} />
      </Routes>
    </AnimatePresence>
  );
};

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(10, 10, 10, 0.8)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '36px', height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--primary), #ff8a33)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', fontSize: '18px', color: '#fff'
        }}>
          <Search size={20} />
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          Find<span className="text-primary">It</span>
        </span>
      </Link>
      
      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }} className="nav-menu">
        <Link to="/status" style={{ fontWeight: 500, transition: 'color 0.2s' }}>Status</Link>
        
        {currentUser ? (
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ borderLeft: '1px solid var(--border-color)', height: '24px' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)', fontWeight: 600 }}>
              <div style={{
                width: '32px', height: '32px',
                borderRadius: '50%',
                backgroundColor: currentUser.role === 'ADMIN' ? 'rgba(255, 107, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: currentUser.role === 'ADMIN' ? 'var(--primary)' : 'inherit'
              }}>
                {currentUser.role === 'ADMIN' ? <Shield size={16} /> : <User size={18} />}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{ fontSize: '0.9rem' }}>{currentUser.username}</span>
                {currentUser.role === 'ADMIN' && (
                  <span style={{ fontSize: '0.65rem', color: 'var(--primary)', textTransform: 'uppercase', fontWeight: 800 }}>Administrator</span>
                )}
              </div>
            </div>
            <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', borderRadius: '8px' }}>Login</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', borderRadius: '8px' }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </BrowserRouter>
  )
}

export default App;
