import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderOpen, ExternalLink, Github, ChevronLeft, ChevronRight, Tag, ArrowUpRight, Circle } from 'lucide-react';
import { projects } from '../data/portfolioData';

export default function Projects() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = projects.length;
  const project = projects[index];

  const go = (dir) => {
    setDirection(dir);
    setIndex((prev) => (prev + dir + total) % total);
  };

  const variants = {
    enter: (d) => ({ opacity: 0, x: d > 0 ? 70 : -70, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d) => ({ opacity: 0, x: d > 0 ? -70 : 70, scale: 0.97 }),
  };

  return (
    <section id="projects" style={{ overflow: 'visible' }}>
      <div className="container">

        {/* ── Header row with counter ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}
        >
          <div>
            <span className="section-label"><FolderOpen size={13} /> Projects</span>
            <h2 className="section-heading">Featured <span className="gradient-text">Work</span></h2>
            <p className="section-sub" style={{ marginBottom: 0 }}>From idea to production-ready application.</p>
          </div>
          {/* Project counter pill */}
          <div style={{
            alignSelf: 'flex-end',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 100, padding: '0.5rem 1.1rem',
            fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)',
            fontVariantNumeric: 'tabular-nums',
          }}>
            <span style={{ color: project.accent, fontWeight: 900 }}>{String(index + 1).padStart(2, '0')}</span>
            <span style={{ opacity: 0.3 }}>/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>
        </motion.div>

        {/* ── Carousel ── */}
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>

          {/* Background glow */}
          <div style={{
            position: 'absolute', inset: -40, zIndex: 0, pointerEvents: 'none',
            background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${project.accent}0a, transparent 80%)`,
            transition: 'background 0.5s ease',
          }} />

          <button onClick={() => go(-1)} style={arrowStyle('left')}>
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => go(1)} style={arrowStyle('right')}>
            <ChevronRight size={18} />
          </button>

          <div style={{ overflow: 'hidden', borderRadius: 24, position: 'relative', zIndex: 1 }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
              >
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.15fr 1fr',
                  minHeight: 480,
                  background: 'rgba(10,18,40,0.8)',
                  border: `1px solid ${project.accent}22`,
                  borderRadius: 24,
                  overflow: 'hidden',
                  boxShadow: `0 0 0 1px ${project.accent}10, 0 32px 80px rgba(0,0,0,0.6)`,
                  backdropFilter: 'blur(16px)',
                }}>

                  {/* ── Left: Image ── */}
                  <div style={{ position: 'relative', overflow: 'hidden' }}>
                    <img
                      src={project.image}
                      alt={project.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.6s ease' }}
                    />
                    {/* Multi-layer overlay for depth */}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(6,13,31,0.08) 0%, rgba(6,13,31,0.65) 100%)' }} />
                    <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(10,18,40,0.85) 0%, transparent 45%)` }} />

                    {/* Top accent gradient stripe */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(to right, ${project.accent}, transparent 70%)` }} />

                    {/* Tag pill */}
                    <div style={{
                      position: 'absolute', top: 18, left: 18,
                      display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                      background: 'rgba(6,13,31,0.75)', backdropFilter: 'blur(12px)',
                      border: `1px solid ${project.accent}45`,
                      borderRadius: 100, padding: '0.3rem 0.8rem',
                    }}>
                      <Tag size={10} color={project.accent} />
                      <span style={{ fontSize: '0.72rem', fontWeight: 800, color: project.accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>{project.tag}</span>
                    </div>

                    {/* Bottom — small floating labels */}
                    <div style={{ position: 'absolute', bottom: 18, left: 18, right: 18, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                      <h3 style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.8)', maxWidth: '70%' }}>
                        {project.title}
                      </h3>
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'rgba(255,255,255,0.25)', fontVariantNumeric: 'tabular-nums', letterSpacing: '0.1em' }}>
                        {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                      </span>
                    </div>
                  </div>

                  {/* ── Right: Content Panel ── */}
                  <div style={{
                    padding: '2.25rem 2.5rem',
                    display: 'flex', flexDirection: 'column',
                    borderLeft: `1px solid ${project.accent}15`,
                    position: 'relative', overflow: 'hidden',
                  }}>
                    {/* Big ghost number */}
                    <div style={{
                      position: 'absolute', top: -10, right: 10,
                      fontSize: '8rem', fontWeight: 900, lineHeight: 1,
                      color: `${project.accent}08`, letterSpacing: '-0.05em',
                      userSelect: 'none', pointerEvents: 'none',
                    }}>
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', gap: '1.5rem' }}>

                      {/* Title */}
                      <div>
                        <h3 style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', fontWeight: 800, lineHeight: 1.3, color: '#f0f4ff', marginBottom: '0.75rem' }}>
                          {project.title}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.91rem', lineHeight: 1.8 }}>
                          {project.description}
                        </p>
                      </div>

                      {/* Divider */}
                      <div style={{ height: 1, background: `linear-gradient(to right, ${project.accent}40, transparent)` }} />

                      {/* Tech stack */}
                      <div>
                        <p style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                          Tech Stack
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {project.tech.map((t) => (
                            <span key={t} style={{
                              fontSize: '0.73rem', fontWeight: 600,
                              padding: '0.3rem 0.72rem', borderRadius: 100,
                              background: `${project.accent}10`,
                              border: `1px solid ${project.accent}28`,
                              color: project.accent,
                            }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto' }}>
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-ghost"
                          style={{ flex: 1, justifyContent: 'center', fontSize: '0.87rem', gap: '0.45rem' }}
                        >
                          <Github size={15} /> Source
                        </a>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn"
                          style={{
                            flex: 1, justifyContent: 'center', fontSize: '0.87rem', gap: '0.45rem',
                            background: project.accent, color: '#fff',
                            boxShadow: `0 4px 20px ${project.accent}40`,
                          }}
                        >
                          Live <ArrowUpRight size={15} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Thumbnail strip ── */}
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          {projects.map((p, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > index ? 1 : -1); setIndex(i); }}
              style={{ flex: 1, background: 'none', border: 'none', padding: 0, cursor: 'pointer', borderRadius: 12, outline: 'none' }}
            >
              <div style={{ height: 68, borderRadius: 12, overflow: 'hidden', position: 'relative', transition: 'box-shadow 0.3s ease', boxShadow: i === index ? `0 0 0 2px ${p.accent}, 0 4px 20px ${p.accent}30` : 'none' }}>
                <img
                  src={p.image}
                  alt={p.title}
                  style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: i === index ? 'none' : 'grayscale(70%) brightness(0.45)',
                    transform: i === index ? 'scale(1.06)' : 'scale(1)',
                    transition: 'filter 0.35s ease, transform 0.35s ease',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(6,13,31,0.8) 0%, transparent 60%)` }} />
                <span style={{
                  position: 'absolute', bottom: 6, left: 8,
                  fontSize: '0.65rem', fontWeight: 800,
                  color: i === index ? p.accent : 'rgba(255,255,255,0.3)',
                  textTransform: 'uppercase', letterSpacing: '0.07em',
                  transition: 'color 0.3s ease',
                }}>
                  {p.tag}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          #projects .container > div:nth-child(3) > div:last-child > div > div {
            grid-template-columns: 1fr !important;
          }
          #projects .container > div:nth-child(3) > div:last-child > div > div > div:first-child {
            height: 220px;
          }
        }
      `}</style>
    </section>
  );
}

const arrowStyle = (side) => ({
  position: 'absolute',
  [side]: -18,
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 10,
  width: 36, height: 36, borderRadius: '50%',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(14,24,48,0.9)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
  transition: 'border-color 0.2s, background 0.2s',
});
