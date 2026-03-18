import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Twitter, Phone, Code } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" style={{ 
      position: 'relative', minHeight: '100vh', padding: '6rem 2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
    }}>
      
      {/* Massive Background Typography */}
      <motion.div 
        animate={{ x: ['-10%', '5%', '-10%'] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', top: '25%', left: '-5%', fontSize: '18vw', lineHeight: 0.85, fontWeight: 900,
          color: 'rgba(255, 255, 255, 0.015)', whiteSpace: 'nowrap', zIndex: 0, pointerEvents: 'none', userSelect: 'none', letterSpacing: '-0.05em'
        }}
      >
        LET'S CONNECT <br />
        <span style={{ marginLeft: '10%' }}>WORK TOGETHER</span>
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* The Header */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '4rem' }}
        >
          <h2 style={{ 
              fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, margin: '0 0 1rem 0', textAlign: 'center',
              background: 'linear-gradient(135deg, #00f0ff 0%, #e52e71 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              letterSpacing: '-2px'
            }}
          >
            Let's Build Something
          </h2>

          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '600px', lineHeight: 1.6 }}>
            My inbox is always open. Whether you have a scalable system architecture problem to solve, a project proposal, or just want to collaborate!
          </p>
        </motion.div>

        {/* Primary Contact Row (Email and Phone grouped together horizontally) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%', marginBottom: '4rem' }}>
          
          {/* Email Block */}
          <motion.a 
            href="mailto:sahil.sheoran.agroha@gmail.com"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(0,240,255,0.2)' }}
            className="glass-panel"
            style={{ 
              textDecoration: 'none', color: '#fff', padding: '3rem 2rem', borderRadius: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              border: '1px solid rgba(0,240,255,0.3)', 
              background: 'linear-gradient(135deg, rgba(10,10,15,0.9) 0%, rgba(0,240,255,0.05) 100%)',
              position: 'relative', overflow: 'hidden'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid #00f0ff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(0,240,255,0.3)' }}>
              <Mail size={32} color="#00f0ff" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Email Me</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>sahil.sheoran.agroha@gmail.com</span>
          </motion.a>

          {/* Phone Block */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, boxShadow: '0 10px 40px rgba(229,46,113,0.2)' }}
            className="glass-panel"
            style={{ 
              color: '#fff', padding: '3rem 2rem', borderRadius: '24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              border: '1px solid rgba(229,46,113,0.3)', 
              background: 'linear-gradient(135deg, rgba(10,10,15,0.9) 0%, rgba(229,46,113,0.05) 100%)',
              position: 'relative', overflow: 'hidden', cursor: 'pointer'
            }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid #e52e71', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(229,46,113,0.3)' }}>
              <Phone size={32} color="#e52e71" />
            </div>
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Call Me</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>+91 98125 91172</span>
          </motion.div>

        </div>

        {/* Navbar Style Social Links */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{
             display: 'flex',
             alignItems: 'center',
             gap: '1.5rem',
             padding: '1rem 2rem',
             borderRadius: '50px', // Floating Pill Nav Style
             background: 'rgba(15, 15, 20, 0.8)',
             backdropFilter: 'blur(16px)',
             WebkitBackdropFilter: 'blur(16px)',
             border: '1px solid rgba(255,255,255,0.05)',
             boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          {/* Label inside the navbar */}
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600, marginRight: '1rem', fontSize: '1.1rem' }}>Socials:</span>
          
          {/* Social Icons mapped sequentially */}
          <SocialIcon icon={<Github size={24} />} link="https://github.com/SahilAgroha" color="#e0e0e0" label="Github" />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          
          <SocialIcon icon={<Linkedin size={24} />} link="https://www.linkedin.com/in/sahilagroha/" color="#0077b5" label="LinkedIn" />
          <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
          
          <SocialIcon icon={<Code size={24} />} link="https://leetcode.com/u/sahilagroha/" color="#1da1f2" label="Leetcode" />
        </motion.div>
      </div>
    </section>
  );
}

// Icon wrapper to manage physics state natively across array loops
function SocialIcon({ icon, link, color, label }) {
  return (
    <motion.a 
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, y: -3, color: color, filter: `drop-shadow(0 0 8px ${color})` }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)'
      }}
      title={label}
    >
      {icon}
    </motion.a>
  );
}
