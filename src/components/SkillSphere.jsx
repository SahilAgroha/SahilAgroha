import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// SKILL DATA  – real devicon CDN URLs
// ─────────────────────────────────────────────────────────────────────────────
const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

const BUILT_IN_SKILLS = [
  { name: 'Java',       icon: `${CDN}/java/java-original.svg`,            glow: '#f89820' },
  { name: 'Spring',     icon: `${CDN}/spring/spring-original.svg`,         glow: '#6db33f' },
  { name: 'React',      icon: `${CDN}/react/react-original.svg`,           glow: '#61dafb' },
  { name: 'TypeScript', icon: `${CDN}/typescript/typescript-original.svg`, glow: '#3178c6' },
  { name: 'JavaScript', icon: `${CDN}/javascript/javascript-original.svg`, glow: '#f7df1e' },
  { name: 'Docker',     icon: `${CDN}/docker/docker-original.svg`,         glow: '#2496ed' },
  { name: 'Git',        icon: `${CDN}/git/git-original.svg`,               glow: '#f05032' },
  { name: 'Python',     icon: `${CDN}/python/python-original.svg`,         glow: '#3776ab' },
  { name: 'MongoDB',    icon: `${CDN}/mongodb/mongodb-original.svg`,       glow: '#47a248' },
  { name: 'PostgreSQL', icon: `${CDN}/postgresql/postgresql-original.svg`, glow: '#336791' },
  { name: 'Redis',      icon: `${CDN}/redis/redis-original.svg`,           glow: '#dc382d' },
  { name: 'AWS',        icon: `${CDN}/amazonwebservices/amazonwebservices-original.svg`, glow: '#ff9900' },
  { name: 'Figma',      icon: `${CDN}/figma/figma-original.svg`,           glow: '#a259ff' },
  { name: 'GitHub',     icon: `${CDN}/github/github-original.svg`,         glow: '#e0e0e0' },
  { name: 'Linux',      icon: `${CDN}/linux/linux-original.svg`,           glow: '#fcc624' },
  { name: 'Tailwind',   icon: `${CDN}/tailwindcss/tailwindcss-plain.svg`,  glow: '#38bdf8' },
  { name: 'Node.js',    icon: `${CDN}/nodejs/nodejs-original.svg`,         glow: '#68a063' },
  { name: 'Next.js',    icon: `${CDN}/nextjs/nextjs-original.svg`,         glow: '#cccccc' },
  { name: 'Kubernetes', icon: `${CDN}/kubernetes/kubernetes-plain.svg`,    glow: '#326ce5' },
  { name: 'MySQL',      icon: `${CDN}/mysql/mysql-original.svg`,           glow: '#4479a1' },
];

// ─────────────────────────────────────────────────────────────────────────────
// MATH
// ─────────────────────────────────────────────────────────────────────────────
function fibonacciSphere(n) {
  const phi = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: n }, (_, i) => {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
}

function rotatePoint(pt, rx, ry) {
  const cy = Math.cos(ry), sy = Math.sin(ry);
  const x1 =  pt.x * cy + pt.z * sy;
  const z1 = -pt.x * sy + pt.z * cy;
  const cx = Math.cos(rx), sx = Math.sin(rx);
  const y1 = pt.y * cx - z1 * sx;
  const z2 = pt.y * sx + z1 * cx;
  return { x: x1, y: y1, z: z2 };
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SkillSphere({ skills }) {
  const resolvedSkills = skills?.length ? skills : BUILT_IN_SKILLS;

  // Responsive radius
  const [radius, setRadius] = useState(240);
  useEffect(() => {
    const upd = () => setRadius(window.innerWidth <= 600 ? window.innerWidth / 2.6 : 240);
    upd();
    window.addEventListener('resize', upd);
    return () => window.removeEventListener('resize', upd);
  }, []);

  const basePoints = useMemo(() => fibonacciSphere(resolvedSkills.length), [resolvedSkills.length]);

  // Rotation lives in refs — no re-render on every frame
  const rotRef  = useRef({ x: 0.18, y: 0 });
  const velRef  = useRef({ x: 0, y: 0.0008 });
  const dragRef = useRef(null);
  const rafRef  = useRef(null);
  const tick    = useRef(0);
  const [frame, setFrame] = useState(0); // single int just to trigger re-render

  const [hoveredIdx, setHoveredIdx] = useState(null);

  // ── Pointer handlers ──────────────────────────────────────────────────────
  const onPointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { px: e.clientX, py: e.clientY };
    velRef.current  = { x: 0, y: 0 };
  }, []);

  const onPointerMove = useCallback((e) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.px;
    const dy = e.clientY - dragRef.current.py;
    velRef.current.y = dx * 0.004;
    velRef.current.x = dy * 0.004;
    rotRef.current.x = Math.max(-0.75, Math.min(0.75, rotRef.current.x + velRef.current.x));
    rotRef.current.y += velRef.current.y;
    dragRef.current = { px: e.clientX, py: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
    if (Math.abs(velRef.current.y) < 0.0008) velRef.current.y = 0.0008;
  }, []);

  // ── RAF loop ──────────────────────────────────────────────────────────────
  useEffect(() => {
    let last = performance.now();
    const loop = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;
      if (!dragRef.current) {
        velRef.current.x *= 0.92;
        velRef.current.y  = velRef.current.y * 0.98 + 0.0008 * 0.02;
        rotRef.current.x += (0 - rotRef.current.x) * 0.018;
        rotRef.current.y += velRef.current.y * (dt / 16);
      }
      tick.current++;
      // throttle react renders to ~60fps without skipping frames
      setFrame(tick.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Project points every render ───────────────────────────────────────────
  const projected = basePoints
    .map((bp, i) => {
      const r     = rotatePoint(bp, rotRef.current.x, rotRef.current.y);
      const depth = (r.z + 1) / 2;
      const scale = 0.52 + depth * 0.78;
      const alpha = 0.10 + depth * 0.90;
      return {
        skill: resolvedSkills[i],
        idx: i,
        sx: r.x * radius,
        sy: r.y * radius,
        scale,
        alpha,
        z: r.z,
        isFront: r.z > -0.15,
      };
    })
    .sort((a, b) => a.z - b.z);

  const containerSize = radius * 2 + 160;
  const cx = containerSize / 2;
  const cy = containerSize / 2;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;700&display=swap');

        .ss-wrap {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          touch-action: none;
          cursor: grab;
        }
        .ss-wrap:active { cursor: grabbing; }

        /* outer breathing aura */
        .ss-aura {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          pointer-events: none;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(99,102,241,0.15) 0%,
            rgba(56,189,248,0.06) 50%,
            transparent 70%
          );
          animation: ssBreath 5s ease-in-out infinite;
        }
        @keyframes ssBreath {
          0%,100% { transform: scale(1);    opacity: .7; }
          50%      { transform: scale(1.07); opacity: 1; }
        }

        /* skill node base */
        .ss-node {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          will-change: transform, opacity;
        }

        /* icon card */
        .ss-card {
          position: relative;
          width: 46px;
          height: 46px;
          border-radius: 13px;
          background: rgba(10,10,28,0.82);
          border: 1px solid rgba(255,255,255,0.09);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          transition: box-shadow .28s ease, border-color .28s ease, transform .28s cubic-bezier(.34,1.56,.64,1);
        }
        .ss-card img {
          width: 27px;
          height: 27px;
          object-fit: contain;
          transition: filter .28s ease;
          pointer-events: none;
          user-select: none;
        }

        /* label */
        .ss-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .07em;
          text-transform: uppercase;
          white-space: nowrap;
          transition: color .28s, text-shadow .28s;
          pointer-events: none;
          user-select: none;
        }

        /* hover — only front nodes */
        .ss-node.front { cursor: pointer; }
        .ss-node.front:hover .ss-card {
          transform: translateY(-4px) scale(1.22);
        }
        .ss-node.front:hover .ss-label {
          color: #fff !important;
        }

        /* pulse rings */
        .ss-ring {
          position: absolute;
          inset: -7px;
          border-radius: 18px;
          border: 1.5px solid var(--gc);
          opacity: 0;
          pointer-events: none;
        }
        .ss-ring2 {
          position: absolute;
          inset: -16px;
          border-radius: 24px;
          border: 1px solid var(--gc);
          opacity: 0;
          pointer-events: none;
        }
        .ss-node.front:hover .ss-ring  { animation: ssPulse 1.15s ease-out infinite; }
        .ss-node.front:hover .ss-ring2 { animation: ssPulse 1.15s ease-out infinite .3s; }
        @keyframes ssPulse {
          0%   { opacity:.6; transform: scale(.82); }
          100% { opacity:0;  transform: scale(1.5); }
        }

        /* tooltip */
        .ss-tooltip {
          position: absolute;
          bottom: -54px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(8,8,22,0.96);
          border-radius: 10px;
          padding: 7px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          pointer-events: none;
          white-space: nowrap;
          animation: ssTooltip .18s ease;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .ss-tooltip-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
        }
        .ss-tooltip-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .06em;
        }
        @keyframes ssTooltip {
          from { opacity:0; transform: translateX(-50%) translateY(6px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div
        className="ss-wrap"
        style={{ width: containerSize, height: containerSize }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Aura */}
        <div className="ss-aura" />

        {/* SVG decorative globe */}
        <svg
          style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
          width={containerSize}
          height={containerSize}
        >
          <defs>
            <radialGradient id="ssFill" cx="42%" cy="36%" r="62%">
              <stop offset="0%"   stopColor="rgba(99,102,241,0.18)" />
              <stop offset="55%"  stopColor="rgba(10,10,30,0.05)" />
              <stop offset="100%" stopColor="rgba(56,189,248,0.12)" />
            </radialGradient>
            <filter id="ssBlur"><feGaussianBlur stdDeviation="1.8"/></filter>
          </defs>

          {/* latitude rings */}
          {[0.38, 0.72, 1.0].map((f, i) => (
            <circle key={i}
              cx={cx} cy={cy} r={radius * f}
              fill="none"
              stroke={i === 2 ? 'rgba(99,102,241,0.28)' : 'rgba(99,102,241,0.10)'}
              strokeWidth={i === 2 ? 1.4 : 0.8}
              filter={i < 2 ? 'url(#ssBlur)' : undefined}
            />
          ))}

          {/* meridians */}
          {[1, 0.68, 0.38].map((r, i) => (
            <ellipse key={i}
              cx={cx} cy={cy}
              rx={Math.max(1, radius * r)} ry={radius}
              fill="none"
              stroke="rgba(99,102,241,0.07)"
              strokeWidth="0.8"
              filter="url(#ssBlur)"
            />
          ))}

          {/* sphere fill + border */}
          <circle cx={cx} cy={cy} r={radius}
            fill="url(#ssFill)"
            stroke="rgba(99,102,241,0.32)"
            strokeWidth="1.5"
          />

          {/* specular highlight */}
          <ellipse
            cx={cx - radius * 0.27} cy={cy - radius * 0.29}
            rx={radius * 0.20} ry={radius * 0.10}
            fill="rgba(255,255,255,0.05)"
          />
          {/* secondary warm bounce */}
          <ellipse
            cx={cx + radius * 0.30} cy={cy + radius * 0.35}
            rx={radius * 0.12} ry={radius * 0.06}
            fill="rgba(99,102,241,0.06)"
          />
        </svg>

        {/* ── Skill nodes ────────────────────────────────────── */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {projected.map((item) => {
            const { skill, idx, sx, sy, scale, alpha, isFront } = item;
            const gc = skill.glow || '#6366f1';
            const isHov = hoveredIdx === idx;

            return (
              <div
                key={idx}
                className={`ss-node${isFront ? ' front' : ''}`}
                style={{
                  '--gc': gc,
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-50%,-50%) translate(${sx}px,${sy}px) scale(${scale})`,
                  opacity: alpha,
                  zIndex: isFront ? Math.round(alpha * 100) + 10 : Math.round(alpha * 100),
                  pointerEvents: isFront ? 'all' : 'none',
                }}
                onMouseEnter={() => isFront && setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div
                  className="ss-card"
                  style={{
                    borderColor: isHov ? `${gc}80` : isFront ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)',
                    boxShadow: isHov
                      ? `0 0 0 1px ${gc}44, 0 0 28px ${gc}55, 0 8px 32px rgba(0,0,0,0.6), inset 0 0 14px ${gc}18`
                      : isFront
                        ? '0 4px 20px rgba(0,0,0,0.55)'
                        : 'none',
                  }}
                >
                  <div className="ss-ring" />
                  <div className="ss-ring2" />
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    draggable={false}
                    style={{
                      filter: isHov
                        ? `drop-shadow(0 0 10px ${gc}) drop-shadow(0 0 4px #fff) brightness(1.2)`
                        : isFront
                          ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.5)) brightness(0.92)'
                          : 'brightness(0.3) saturate(0.2)',
                    }}
                  />
                </div>

                <span
                  className="ss-label"
                  style={{
                    color: isHov ? '#fff' : isFront ? 'rgba(190,205,225,0.78)' : 'rgba(80,90,120,0.45)',
                    textShadow: isHov ? `0 0 14px ${gc}cc, 0 1px 4px rgba(0,0,0,0.9)` : '0 1px 5px rgba(0,0,0,0.9)',
                  }}
                >
                  {skill.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* ── Floating tooltip ─────────────────────────────────── */}
        {hoveredIdx !== null && (() => {
          const n = projected.find(p => p.idx === hoveredIdx);
          if (!n) return null;
          const gc = n.skill.glow || '#6366f1';
          return (
            <div
              className="ss-tooltip"
              style={{ boxShadow: `0 0 30px ${gc}33, 0 4px 24px rgba(0,0,0,0.6)`, borderColor: `${gc}33` }}
            >
              <div className="ss-tooltip-dot" style={{ background: gc, boxShadow: `0 0 8px ${gc}` }} />
              <img src={n.skill.icon} alt="" width={18} height={18} style={{ objectFit: 'contain' }} />
              <span className="ss-tooltip-text" style={{ color: gc }}>{n.skill.name}</span>
            </div>
          );
        })()}
      </div>
    </>
  );
}