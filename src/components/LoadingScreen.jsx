import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ isLoading }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    
    // Simulate progress mounting to 100% over precisely 3 seconds
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.floor(Math.random() * 6) + 2;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999, // Guaranteeing it sits above all UI elements including Framer overlays
            background: '#050505',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <div style={{ position: 'relative', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer Spinning Arc */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                border: '4px solid transparent',
                borderTopColor: '#00f0ff',
                borderRightColor: '#e52e71',
                boxShadow: '0 0 20px rgba(0,240,255,0.2)',
              }}
            />
            
            {/* Inner Counter-Spinning Arc */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: '20px',
                borderRadius: '50%',
                border: '4px solid transparent',
                borderBottomColor: '#9d4edd',
                borderLeftColor: '#00f0ff',
                opacity: 0.7
              }}
            />

            {/* Glowing Text */}
            <motion.div
               key={progress} // Force slight re-render bump on percentage change
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                letterSpacing: '4px',
                background: 'linear-gradient(90deg, #00f0ff, #e52e71)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textAlign: 'center'
              }}
            >
              {Math.min(progress, 100)}%
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: '3rem',
              color: 'var(--text-secondary)',
              letterSpacing: '8px',
              fontSize: '1.2rem',
              textTransform: 'uppercase'
            }}
          >
            Initializing WebGL
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
