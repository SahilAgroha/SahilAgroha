import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, GraduationCap } from 'lucide-react';
import { timeline } from '../data/portfolioData';

const typeIcon = { work: <Briefcase size={16} />, education: <GraduationCap size={16} /> };

export default function Experience() {
  return (
    <section id="experience">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label"><Briefcase size={13} /> Experience</span>
          <h2 className="section-heading">My <span className="gradient-text">Journey</span></h2>
          <p className="section-sub">Work experience and educational background that shaped my engineering mindset.</p>
        </motion.div>

        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
          <div style={{
            position: 'absolute', left: '1rem', top: 0, bottom: 0, width: 2,
            background: 'linear-gradient(to bottom, var(--blue) 0%, var(--amber) 100%)',
            opacity: 0.25, borderRadius: 1,
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            {timeline.map(({ type, period, title, org, location, points, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                style={{ position: 'relative' }}
              >
                <div style={{
                  position: 'absolute', left: '-2rem', top: '1.6rem',
                  transform: 'translateX(calc(-2rem + 7px))',
                  width: 16, height: 16, borderRadius: '50%',
                  background: accent, border: '3px solid var(--bg)',
                  boxShadow: `0 0 12px ${accent}60`, zIndex: 1,
                }} />
                <div className="card" style={{ marginLeft: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        fontSize: '0.78rem', fontWeight: 600, color: accent,
                        background: `${accent}15`, border: `1px solid ${accent}30`,
                        padding: '0.25rem 0.7rem', borderRadius: 100, marginBottom: '0.6rem',
                      }}>
                        {typeIcon[type]} {period}
                      </span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {org} · <span style={{ color: 'var(--text-muted)' }}>{location}</span>
                      </p>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                    {points.map((point, pi) => (
                      <li key={pi} style={{ display: 'flex', gap: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        <span style={{ color: accent, flexShrink: 0, marginTop: '0.3rem' }}>▸</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
