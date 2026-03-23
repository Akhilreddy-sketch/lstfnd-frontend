import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { PlusCircle, Search, ShieldCheck } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } }
};

const homeStagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 }
};

export default function Home() {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="page-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}
    >
      <motion.div variants={homeStagger} initial="initial" animate="animate" style={{ textAlign: 'center', maxWidth: '800px' }}>
        <motion.div variants={itemVariants} style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          color: 'var(--primary)',
          borderRadius: '30px',
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          #1 AI-Powered Lost & Found Platform
        </motion.div>

        <motion.h1 variants={itemVariants} style={{ fontSize: '4rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
          Lost it? <span className="text-primary">Find it.</span><br />
          Found it? <span className="text-primary">Share it.</span>
        </motion.h1>

        <motion.p variants={itemVariants} className="text-muted" style={{ fontSize: '1.25rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
          Connect with your community to return lost items securely. Quick reporting, smart matching, and instant updates.
        </motion.p>

        <motion.div variants={itemVariants} style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/report/lost" className="btn btn-primary" style={{ padding: '16px 32px', fontSize: '1.1rem' }}>
            <Search size={20} />
            Report Lost Item
          </Link>
          <Link to="/report/found" className="btn" style={{ padding: '16px 32px', fontSize: '1.1rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
            <PlusCircle size={20} />
            Report Found Item
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} style={{ marginTop: '30px' }}>
          <Link to="/status" className="btn btn-outline" style={{ padding: '12px 24px' }}>
            <ShieldCheck size={20} />
            Check Status
          </Link>
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
