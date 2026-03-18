import React from 'react';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';

export default function ResumeButton() {
  // Hardcoded route relative to the /public directory locally
  const resumeUrl = "/resume.pdf";

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
      whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)' }}
      whileTap={{ scale: 0.9 }}
      onClick={() => window.open(resumeUrl, '_blank')}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        right: '2.5rem',
        zIndex: 100, // Safe layer natively towering over Canvas WebGL pointers
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(15, 15, 20, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(0,240,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#00f0ff',
      }}
      title="Download Resume"
    >
      {/* Natively wobbling document icon drawing attention continuously */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <FileDown size={28} strokeWidth={2} />
      </motion.div>
    </motion.button>
  );
}
