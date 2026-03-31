import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, ChevronRight, ArrowUpRight } from 'lucide-react';
import { timeline } from '../data/portfolioData';

const TYPE_CONFIG = {
  work:      { icon: Briefcase,      label: 'Work Experience', color: '#3b82f6' },
  education: { icon: GraduationCap,  label: 'Education',       color: '#f59e0b' },
};

/* ── animated bullet line ───────────────────────────────────────────────── */
function AnimatedLine({ accent }) {
  const ref  = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      initial={{ scaleY: 0 }}
      animate={inView ? { scaleY: 1 } : {}}
      transition={{ duration: .9, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'absolute', left: 'calc(50% - 1px)',
        top: 0, bottom: 0, width: 2,
        background: `linear-gradient(to bottom, ${accent}80, ${accent}10)`,
        transformOrigin: 'top', borderRadius: 1,
      }}
    />
  );
}

/* ── single card ─────────────────────────────────────────────────────────── */
function TimelineCard({ item, index, isLast }) {
  const [hovered, setHovered] = useState(false);
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const isLeft = index % 2 === 0;
  const Ico    = TYPE_CONFIG[item.type]?.icon || Briefcase;
  const typeColor = TYPE_CONFIG[item.type]?.color || '#6366f1';
  const accent = item.accent?.startsWith('var(')
    ? (item.type === 'work' ? '#3b82f6' : '#f59e0b')
    : item.accent || '#6366f1';

  const cardVariants = {
    hidden: { opacity: 0, x: isLeft ? -50 : 50, y: 20 },
    show:   { opacity: 1, x: 0, y: 0, transition: { duration: .7, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', alignItems: 'start', marginBottom: isLast ? 0 : '3.5rem', position: 'relative' }}>

      {/* LEFT slot */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: '2rem', paddingTop: '.5rem' }}>
        {isLeft ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            style={{ width: '100%', maxWidth: 440 }}
          >
            <Card item={item} accent={accent} Ico={Ico} hovered={hovered} setHovered={setHovered} />
          </motion.div>
        ) : (
          /* period label on right card's left */
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: .3, duration: .6 }}
            style={{ textAlign: 'right' }}
          >
            <PeriodBadge period={item.period} accent={accent} />
          </motion.div>
        )}
      </div>

      {/* CENTER spine */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
        {/* connector line down */}
        {!isLast && (
          <div style={{
            position: 'absolute', top: 44, bottom: -56, left: '50%',
            transform: 'translateX(-50%)', width: 2,
            background: `linear-gradient(to bottom, ${accent}35, rgba(255,255,255,0.04))`,
          }}/>
        )}

        {/* node */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: .15, duration: .5, type: 'spring', stiffness: 200 }}
          style={{
            width: 46, height: 46, borderRadius: '50%', flexShrink: 0, zIndex: 2,
            background: `linear-gradient(135deg, ${accent}22 0%, ${accent}10 100%)`,
            border: `2px solid ${accent}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 0 6px ${accent}0d, 0 0 28px ${accent}30`,
            position: 'relative',
          }}
        >
          {/* pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `1.5px solid ${accent}40`, pointerEvents: 'none',
            }}
          />
          <Ico size={18} color={accent} />
        </motion.div>

        {/* type label below node */}
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: .25 }}
          style={{
            marginTop: '.45rem', fontSize: '.6rem', fontWeight: 800,
            letterSpacing: '.12em', textTransform: 'uppercase',
            color: accent, textAlign: 'center', whiteSpace: 'nowrap',
          }}
        >
          {TYPE_CONFIG[item.type]?.label}
        </motion.span>
      </div>

      {/* RIGHT slot */}
      <div style={{ paddingLeft: '2rem', paddingTop: '.5rem' }}>
        {!isLeft ? (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            style={{ width: '100%', maxWidth: 440 }}
          >
            <Card item={item} accent={accent} Ico={Ico} hovered={hovered} setHovered={setHovered} />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: .3, duration: .6 }}
          >
            <PeriodBadge period={item.period} accent={accent} />
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PeriodBadge({ period, accent }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '.4rem',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '.78rem', fontWeight: 600, color: accent,
      background: `${accent}10`, border: `1px solid ${accent}28`,
      borderRadius: 100, padding: '.3rem .85rem',
      marginTop: '.7rem',
    }}>
      <Calendar size={11}/> {period}
    </div>
  );
}

function Card({ item, accent, Ico, hovered, setHovered }) {
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      style={{
        background: hovered
          ? `linear-gradient(145deg, rgba(12,18,44,0.97) 0%, rgba(${hexToRgbStr(accent)},0.06) 100%)`
          : 'rgba(10,14,36,0.85)',
        border: `1px solid ${hovered ? accent + '38' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 20,
        padding: '1.7rem 2rem',
        backdropFilter: 'blur(14px)',
        boxShadow: hovered
          ? `0 0 0 1px ${accent}18, 0 24px 64px rgba(0,0,0,0.55), 0 0 48px ${accent}14`
          : '0 8px 40px rgba(0,0,0,0.4)',
        transition: 'background .35s ease, border-color .35s ease, box-shadow .35s ease',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* top accent bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, ${accent}, ${accent}00 80%)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity .35s',
      }}/>

      {/* ghost icon */}
      <div style={{
        position: 'absolute', right: -10, top: -10,
        opacity: hovered ? 0.06 : 0.03, transition: 'opacity .3s',
      }}>
        <Ico size={90} color={accent}/>
      </div>

      {/* header */}
      <div style={{ marginBottom: '1.1rem' }}>
        <h3 style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 'clamp(.95rem, 1.6vw, 1.15rem)',
          fontWeight: 800, color: '#f0f4ff',
          lineHeight: 1.3, margin: '0 0 .45rem',
        }}>{item.title}</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '.5rem .75rem' }}>
          <span style={{ fontSize: '.85rem', fontWeight: 600, color: accent }}>
            {item.org}
          </span>
          {item.location && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem', fontSize: '.78rem', color: 'rgba(150,165,205,0.55)', fontWeight: 500 }}>
              <MapPin size={10}/> {item.location}
            </span>
          )}
        </div>
      </div>

      {/* divider */}
      <div style={{ height: 1, background: `linear-gradient(90deg, ${accent}30, transparent 70%)`, marginBottom: '1.1rem' }}/>

      {/* bullet points */}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '.55rem' }}>
        {item.points.map((pt, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: .4 }}
            style={{ display: 'flex', gap: '.65rem', fontSize: '.875rem', color: 'rgba(168,184,220,0.78)', lineHeight: 1.65 }}
          >
            <ChevronRight size={13} color={accent} style={{ flexShrink: 0, marginTop: '.28rem' }}/>
            <span>{pt}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

/* hex → "r,g,b" for rgba() */
function hexToRgbStr(hex) {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c+c).join('') : h, 16);
  return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
}

/* ── section ─────────────────────────────────────────────────────────────── */
export default function Experience() {
  return (
    <section id="experience" style={{ padding: '8rem 0 9rem', overflow: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@500;600&display=swap');
        #experience * { box-sizing: border-box; }

        /* mobile: stack */
        @media (max-width: 720px) {
          .exp-grid { grid-template-columns: 40px 1fr !important; }
          .exp-left-hide { display: none !important; }
          .exp-right-full { grid-column: 2 !important; padding-left: 1.25rem !important; }
          .exp-center-col { grid-column: 1 !important; }
        }
      `}</style>

      <div className="container">

        {/* ── heading ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: .75, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: '.4em' }}
            whileInView={{ opacity: 1, letterSpacing: '.18em' }}
            viewport={{ once: true }}
            transition={{ duration: .8 }}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '.68rem', fontWeight: 600,
              textTransform: 'uppercase', color: '#6366f1',
              letterSpacing: '.18em', marginBottom: '.75rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.5rem',
            }}
          >
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: '#6366f1' }}/>
            Career Timeline
            <span style={{ display: 'inline-block', width: 28, height: 1.5, background: '#6366f1' }}/>
          </motion.p>

          <h2 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: 800, lineHeight: 1.05,
            color: '#f0f4ff', margin: '0 0 .5rem',
            letterSpacing: '-.03em',
          }}>
            My{' '}
            <span style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 60%, #38bdf8 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Journey</span>
          </h2>
          <p style={{ color: 'rgba(155,170,210,0.65)', fontSize: '.95rem', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            The experiences and milestones that shaped my engineering mindset.
          </p>
        </motion.div>

        {/* ── two-column timeline ─────────────────────────────────── */}
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative' }}>

          {/* centre vertical spine */}
          <div style={{
            position: 'absolute', left: '50%', top: 44, bottom: 44,
            transform: 'translateX(-50%)', width: 2,
            background: 'linear-gradient(to bottom, #6366f133, #f59e0b22, rgba(255,255,255,0.04))',
            borderRadius: 1,
          }}/>

          {timeline.map((item, i) => (
            <TimelineCard key={item.title} item={item} index={i} isLast={i === timeline.length - 1}/>
          ))}
        </div>

        {/* ── bottom CTA ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: .3, duration: .6 }}
          style={{ textAlign: 'center', marginTop: '4rem' }}
        >
          <a
            href="https://www.linkedin.com/in/sahilagroha/"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '.55rem',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '.82rem', fontWeight: 600, letterSpacing: '.06em',
              color: '#6366f1', textDecoration: 'none',
              background: 'rgba(99,102,241,0.08)',
              border: '1px solid rgba(99,102,241,0.28)',
              borderRadius: 100, padding: '.65rem 1.6rem',
              transition: 'background .25s, box-shadow .25s, transform .2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.18)';
              e.currentTarget.style.boxShadow  = '0 0 24px rgba(99,102,241,0.3)';
              e.currentTarget.style.transform  = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(99,102,241,0.08)';
              e.currentTarget.style.boxShadow  = 'none';
              e.currentTarget.style.transform  = 'translateY(0)';
            }}
          >
            View Full Profile on LinkedIn <ArrowUpRight size={14}/>
          </a>
        </motion.div>
      </div>
    </section>
  );
}