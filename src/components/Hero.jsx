import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Github, Linkedin, Mail, MapPin, Briefcase } from 'lucide-react';
import profileImg from '../assets/profile.png';
import { personal, roles, heroStats } from '../data/portfolioData';

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const role = roles[roleIndex];
    let speed = deleting ? 28 : 80;

    if (!deleting && displayed === role) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && displayed === '') {
      setDeleting(false);
      setRoleIndex((p) => (p + 1) % roles.length);
      return;
    }

    const t = setTimeout(() => {
      setDisplayed(deleting
        ? role.slice(0, displayed.length - 1)
        : role.slice(0, displayed.length + 1)
      );
    }, speed);
    return () => clearTimeout(t);
  }, [displayed, deleting, roleIndex]);

  const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
  const item = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } } };

  return (
    <section id="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 0 5rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '4rem', alignItems: 'center' }}>

          {/* ── Left Content ── */}
          <motion.div variants={container} initial="hidden" animate="show" style={{ maxWidth: 620 }}>
            <motion.div variants={item} style={{ marginBottom: '1.5rem' }}>
              <span className="section-label" style={{ gap: '0.4rem' }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 0 3px rgba(16,185,129,0.2)',
                  display: 'inline-block'
                }} />
                {personal.availableForWork ? 'Available for opportunities' : 'Currently unavailable'}
              </span>
            </motion.div>

            <motion.h1 variants={item} style={{ fontSize: 'clamp(2.8rem, 7vw, 5rem)', fontWeight: 900, marginBottom: '1rem', letterSpacing: '-0.03em' }}>
              Hi, I'm <span className="gradient-text" style={{ display: 'block',marginTop: '0.5rem',
      fontSize: '0.5em' }}>{personal.name}</span>
            </motion.h1>

            <motion.div variants={item} style={{ marginBottom: '1.5rem', minHeight: '2.4rem' }}>
              <p style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)', fontWeight: 600, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-primary)' }}>{displayed}</span>
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ display: 'inline-block', width: 3, height: '1.1em', background: 'var(--blue)', marginLeft: 4, borderRadius: 2, verticalAlign: 'middle' }}
                />
              </p>
            </motion.div>

            <motion.p variants={item} style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              {personal.bio}
            </motion.p>

            <motion.div variants={item} style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              {[
                { icon: <MapPin size={15} />, text: personal.location },
                { icon: <Briefcase size={15} />, text: personal.tagline },
              ].map(({ icon, text }) => (
                <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  {icon} {text}
                </span>
              ))}
            </motion.div>

            <motion.div variants={item} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <a href="#contact" className="btn btn-primary" style={{ fontSize: '0.95rem' }}>
                Get In Touch <ArrowRight size={17} />
              </a>
              <a href="#projects" className="btn btn-ghost" style={{ fontSize: '0.95rem' }}>
                View Projects
              </a>
            </motion.div>

            <motion.div variants={item} style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { icon: <Github size={19} />, href: personal.github, label: 'GitHub' },
                { icon: <Linkedin size={19} />, href: personal.linkedin, label: 'LinkedIn' },
                { icon: <Mail size={19} />, href: `mailto:${personal.email}`, label: 'Email' },
              ].map(({ icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  whileHover={{ y: -3, color: 'var(--blue-light)' }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: 40, height: 40, borderRadius: 10,
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    color: 'var(--text-secondary)', transition: 'border-color 0.2s ease',
                  }}
                >
                  {icon}
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Profile Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
            style={{ flexShrink: 0 }}
          >
            <div style={{ position: 'relative', width: 280 }}>
              <div style={{
                position: 'absolute', inset: -20, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)',
                filter: 'blur(20px)', zIndex: 0,
              }} />
              <div style={{
                position: 'relative', zIndex: 1,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 24, padding: '1.5rem', backdropFilter: 'blur(12px)',
              }}>
                <div style={{ width: '100%', aspectRatio: '1 / 1', borderRadius: 16, overflow: 'hidden', background: 'var(--surface)', marginBottom: '1.25rem' }}>
                  <img src={profileImg} alt={personal.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>{personal.name}</p>
                  <p style={{ color: 'var(--blue)', fontSize: '0.85rem', fontWeight: 500 }}>{personal.tagline}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  {heroStats.map(({ val, label }) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <p style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--blue-light)' }}>{val}</p>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</p>
                    </div>
                  ))}
                </div>
              </div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                  position: 'absolute', top: -14, right: -18,
                  background: 'var(--surface)', border: '1px solid var(--border-accent)',
                  borderRadius: 12, padding: '0.45rem 0.8rem',
                  fontSize: '0.8rem', fontWeight: 600, color: 'var(--blue-light)',
                  boxShadow: 'var(--shadow-blue)', zIndex: 2, whiteSpace: 'nowrap',
                }}
              >
                🚀 Open to work
              </motion.div>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                style={{
                  position: 'absolute', bottom: -14, left: -18,
                  background: 'var(--surface)', border: '1px solid rgba(245,158,11,0.4)',
                  borderRadius: 12, padding: '0.45rem 0.8rem',
                  fontSize: '0.8rem', fontWeight: 600, color: 'var(--amber)',
                  zIndex: 2, whiteSpace: 'nowrap',
                }}
              >
                💡 Java · React
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      <style>{`
        @media (max-width: 900px) {
          #hero .container > div { grid-template-columns: 1fr !important; }
          #hero .container > div > div:last-child { display: none; }
        }
      `}</style>
    </section>
  );
}
