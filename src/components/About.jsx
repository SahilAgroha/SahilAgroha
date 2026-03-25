import React from 'react';
import { motion } from 'framer-motion';
import { User, Server, Globe, Cpu } from 'lucide-react';
import { aboutStats, aboutFocuses } from '../data/portfolioData';

const iconMap = { '⚙️': <Server size={22} />, '🎨': <Globe size={22} />, '🛠️': <Cpu size={22} /> };

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label"><User size={13} /> About Me</span>
          <h2 className="section-heading">Crafting Digital <span className="gradient-text">Experiences</span></h2>
          <p className="section-sub">
            I'm a passionate Full Stack Developer who loves turning complex problems into clean, elegant solutions. I thrive on building products that are fast, secure, and a joy to use.
          </p>
        </motion.div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '3.5rem' }}>
          {aboutStats.map(({ value, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card"
              style={{ textAlign: 'center', padding: '1.5rem 1rem' }}
            >
              <p style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--blue-light)', letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', fontWeight: 500, marginTop: '0.25rem' }}>{label}</p>
            </motion.div>
          ))}
        </div>

        {/* Focus Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          {aboutFocuses.map(({ emoji, title, desc, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: `${color}18`, border: `1px solid ${color}35`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', color,
              }}>
                {iconMap[emoji] || <Server size={22} />}
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
