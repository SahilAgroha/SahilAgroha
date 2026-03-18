import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import heroImg from '../assets/profile.png';

export default function About() {
  return (
    <section id="about" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
        style={{ width: '100%' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '4rem', alignItems: 'center' }}>
          
          {/* Left Side: Advanced Dark Glass HUD encapsulating all text */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'var(--text-secondary)',
            background: "rgba(5, 5, 10, 0.8)", 
            backdropFilter: "blur(20px)", 
            WebkitBackdropFilter: "blur(20px)",
            padding: "3rem", 
            borderRadius: "24px",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.02)"
          }}>

            <motion.h2 
              initial={{ opacity: 0, letterSpacing: '-0.5em' }}
              whileInView={{ opacity: 1, letterSpacing: '0.05em' }}
              transition={{ duration: 1, ease: 'easeOut' }}
              style={{ 
                fontSize: '3.5rem', marginBottom: '1rem', fontWeight: 800,
                background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                marginTop: 0
              }}
            >
              About Me
            </motion.h2>
            <p>
              I am a passionate <strong style={{color: 'var(--text-primary)'}}>Full Stack Developer</strong> specializing in building scalable web applications using Spring Boot and React.
            </p>
            <p>
              I enjoy solving real-world problems, designing modern UI experiences, and working with cutting-edge technologies. My goal is to craft digital experiences that not only function flawlessly but also look stunning.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '1rem',
              marginTop: '1rem'
            }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Backend</h3>
                <p style={{ fontSize: '0.95rem' }}>Secure APIs, Microservices, Spring Boot</p>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                <h3 style={{ color: 'var(--accent-purple)', marginBottom: '0.5rem', fontSize: '1.2rem' }}>Frontend</h3>
                <p style={{ fontSize: '0.95rem' }}>Modern UI/UX, React, 3D Animations</p>
              </div>
            </div>
          </div>

          {/* Right Side: Hanging Elastic Card */}
          <div style={{ 
            position: 'relative', 
            height: '450px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            paddingTop: '60px' // Make room for thread
          }}>
            
            {/* The Thread / String rendering static behind the card */}
            <div style={{ 
              position: 'absolute', 
              top: '0', 
              width: '2px', 
              height: '60px', 
              background: 'linear-gradient(to bottom, transparent, var(--accent-purple))',
              zIndex: 0 
            }} />
            
            {/* The Draggable Card containing the Photo */}
            <motion.div
              drag
              dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
              dragElastic={0.95} // Severely increased elasticity for huge physics pull bounds requested natively!
              dragTransition={{ bounceStiffness: 400, bounceDamping: 10 }}
              whileDrag={{ scale: 1.05, cursor: 'grabbing', rotate: 5 }} 
              whileHover={{ scale: 1.02 }}
              className="glass-panel"
              style={{
                width: '260px',
                padding: '1rem',
                cursor: 'grab',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 25px 50px -12px rgba(170,59,255,0.15)',
                borderTop: '4px solid var(--accent-purple)', // Looks like a pin/attachment point
                background: 'rgba(5,5,5,0.8)'
              }}
            >
              <div style={{ 
                width: '100%', 
                aspectRatio: '1/1', 
                borderRadius: '8px', 
                overflow: 'hidden', 
                background: 'var(--bg-secondary)',
                marginBottom: '1rem'
              }}>
                <img src={heroImg} alt="Sahil Photo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} draggable="false" />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1.2rem', margin: 0 }}>Sahil</p>
              <p style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', margin: 0 }}>Full Stack Dev</p>
            </motion.div>

          </div>

        </div>
      </motion.div>
    </section>
  );
}
