import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { techCategories } from '../data/portfolioData';

// Flatten all skills into one pool
const allSkills = techCategories.flatMap(cat => cat.skills);

// Deterministic float config per skill so it never changes on re-render
const floatConfigs = allSkills.map((_, i) => ({
  yAmp: 10 + (i * 7) % 14,
  xAmp: 4 + (i * 5) % 10,
  duration: 3.2 + (i * 0.4) % 2.4,
  xDuration: 4 + (i * 0.6) % 3,
  delay: (i * 0.35) % 2.5,
  rotate: 360,
  rotateDuration: 2.5 + (i * 0.3) % 2, // spinning gradient speed
}));

export default function TechStack() {
  return (
    <section id="tech-stack">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label"><Layers size={13} /> Tech Stack</span>
          <h2 className="section-heading">Tools I <span className="gradient-text">Work With</span></h2>
          <p className="section-sub">Technologies I use to build reliable, scalable, and beautiful software.</p>
        </motion.div>

        {/* Floating skill orbs */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2rem',
          padding: '1rem 0 2rem',
        }}>
          {allSkills.map((skill, i) => {
            const cfg = floatConfigs[i];
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: i * 0.06 }}
                animate={{
                  y: [0, -cfg.yAmp, 0],
                  x: [0, cfg.xAmp, 0],
                }}
                // Keep float independent of whileInView by using separate transition for animate
                style={{ willChange: 'transform' }}
              >
                {/* Override animate transition separately */}
                <FloatingSkill skill={skill} cfg={cfg} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FloatingSkill({ skill, cfg }) {
  return (
    <motion.div
      animate={{
        y: [0, -cfg.yAmp, 0],
        x: [0, cfg.xAmp, 0],
      }}
      transition={{
        y: { duration: cfg.duration, repeat: Infinity, ease: 'easeInOut', delay: cfg.delay },
        x: { duration: cfg.xDuration, repeat: Infinity, ease: 'easeInOut', delay: cfg.delay + 0.5 },
      }}
      whileHover={{ scale: 1.12, zIndex: 10 }}
      style={{
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: '50%',
        cursor: 'default',
        flexShrink: 0,
      }}
    >
      {/* ── Spinning conic-gradient border ── */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: cfg.rotateDuration, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute',
          inset: -2,
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, transparent 0%, transparent 55%, #3b82f6 75%, #f59e0b 88%, transparent 100%)',
          zIndex: 0,
        }}
      />

      {/* ── Inner dark fill ── */}
      <div style={{
        position: 'absolute',
        inset: 3,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 35%, #111c38, #060d1f)',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
      }}>
        <img
          src={skill.icon}
          alt={skill.name}
          style={{ width: 36, height: 36, objectFit: 'contain', filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.4))' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        <span style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          color: '#c8d8f0',
          letterSpacing: '0.02em',
          textAlign: 'center',
          lineHeight: 1.1,
          padding: '0 4px',
        }}>
          {skill.name}
        </span>
      </div>
    </motion.div>
  );
}
