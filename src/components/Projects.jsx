import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'BuyBaazar (E-Commerce)',
    description: 'A scalable e-commerce platform with secure payment integration. Features include user auth, product listing, cart system, and an admin dashboard.',
    tech: ['React', 'Spring Boot', 'Security', 'MySQL','Docker'],
    link: '#',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'Hiredly (Job Portal)',
    description: 'A modern job portal platform connecting recruiters and candidates with features like job posting, application tracking, authentication, and notifications.',
    tech: ['React', 'Spring Boot', 'JWT Auth', 'MySQL'],
    link: '#',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'NexaMed (Healthcare System)',
    description: 'A healthcare management system for handling patient records, appointments, and secure role-based access with scalable backend architecture.',
    tech: ['React', 'Spring Boot', 'Spring Security', 'MySQL'],
    link: '#',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop'
  }
];

export default function Projects() {
  const [activeIndex, setActiveIndex] = useState(1); // Start with middle card
  
  const next = () => setActiveIndex((prev) => Math.min(prev + 1, projects.length - 1));
  const prev = () => setActiveIndex((prev) => Math.max(prev - 1, 0));

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) next();
    else if (swipe > 50) prev();
  };

  return (
    <section id="projects" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <motion.h2 
        initial={{ rotateX: 90, opacity: 0 }}
        whileInView={{ rotateX: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 10 }}
        style={{ 
          fontSize: '3.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: 900,
          background: 'linear-gradient(to right, #b8c6db 0%, #f5f7fa 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          transformOrigin: 'bottom'
        }}
      >
        Featured Projects
      </motion.h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem', fontSize: '1.1rem' }}>
        Swipe or click a card to focus. Click an active card to flip it over!
      </p>

      {/* Viewport for Coverflow */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1000px',
        height: '450px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px', // 3D depth field for the coverflow
      }}>
        
        {/* Navigation Arrows */}
        <button 
          onClick={prev} 
          disabled={activeIndex === 0}
          style={{ position: 'absolute', left: '10px', zIndex: 100, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', padding: '10px', cursor: activeIndex === 0 ? 'not-allowed' : 'pointer', opacity: activeIndex === 0 ? 0.2 : 1 }}
        >
          <ChevronLeft size={32} />
        </button>

        <motion.div 
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
          style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          {projects.map((project, index) => {
            return (
              <ProjectCard 
                key={index} 
                project={project} 
                index={index} 
                activeIndex={activeIndex} 
                setActiveIndex={setActiveIndex} 
              />
            );
          })}
        </motion.div>

        <button 
          onClick={next} 
          disabled={activeIndex === projects.length - 1}
          style={{ position: 'absolute', right: '10px', zIndex: 100, background: 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '50%', padding: '10px', cursor: activeIndex === projects.length - 1 ? 'not-allowed' : 'pointer', opacity: activeIndex === projects.length - 1 ? 0.2 : 1 }}
        >
          <ChevronRight size={32} />
        </button>

      </div>
    </section>
  );
}

function ProjectCard({ project, index, activeIndex, setActiveIndex }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const isActive = index === activeIndex;

  // Calculate Coverflow 3D Math based on distance from active center
  const diff = index - activeIndex;
  // If diff is 0, it's center.
  // If diff < 0 (e.g. -1), it's to the left.
  // If diff > 0 (e.g. 1), it's to the right.
  
  const xOffset = diff * 220; // Spread out horizontally
  const zOffset = isActive ? 100 : -200 - Math.abs(diff) * 100; // Active pops out, inactive goes deep inside
  const rotateY = isActive ? 0 : diff > 0 ? -45 : 45; // Inactive cards turn inwards to face the center
  const scale = isActive ? 1 : 0.8; 
  const opacity = isActive ? 1 : Math.max(0, 1 - Math.abs(diff) * 0.4);
  const zIndex = 50 - Math.abs(diff); // Center card is always on top

  const handleCardClick = () => {
    if (!isActive) {
      setActiveIndex(index);
      setIsFlipped(false); // Reset flip if clicking a side card
    } else {
      setIsFlipped(!isFlipped);
    }
  };

  return (
    <motion.div
      initial={false}
      animate={{
        x: xOffset,
        z: zOffset, // This handles the "coming out and going inside" the screen effect!
        rotateY: rotateY,
        scale: scale,
        opacity: opacity,
        zIndex: zIndex
      }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.6 }}
      onClick={handleCardClick}
      style={{
        position: 'absolute',
        width: '320px',
        height: '420px',
        transformStyle: 'preserve-3d', // Extremely important for the flip card nested mechanics
        cursor: isActive ? 'pointer' : 'grab' // Grab to swipe, click active to flip
      }}
    >
      
      {/* 
        Inner Wrapper that actually flips physically 180 degrees.
        We separate this from the outer motion.div so the coverflow transforms 
        (slide left/right) don't conflict with the 180deg flip transform.
      */}
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        
        {/* ================= FRONT SIDE ================= */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          borderRadius: '16px',
          overflow: 'hidden',
          background: '#111',
          border: '1px solid var(--glass-border)',
          boxShadow: isActive ? '0 15px 40px -10px rgba(0, 240, 255, 0.4)' : '0 10px 30px -10px rgba(0,0,0,0.8)',
          transform: 'translateZ(1px)' // Fights z-fight tearing on some browsers
        }}>
          {/* Main Photo Background */}
          <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
             <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
             {/* Beautiful dark gradient fade covering the bottom half so text is readable */}
             <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,1) 10%, rgba(5,5,5,0.4) 60%, transparent 100%)' }} />
          </div>

          {/* Front Content */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, lineHeight: 1.2 }}>{project.title}</h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  fontSize: '0.75rem', color: 'var(--accent-cyan)', background: 'rgba(0,0,0,0.6)',
                  padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.2)'
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          {/* Flip Indicator */}
          {isActive && (
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.5)', padding: '5px 10px', borderRadius: '20px', fontSize: '0.8rem', color: '#fff', backdropFilter: 'blur(5px)' }}
            >
              Click to Flip ↺
            </motion.div>
          )}
        </div>


        {/* ================= BACK SIDE (Details) ================= */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
          transform: 'rotateY(180deg) translateZ(1px)', // Initial rotated state so it shows up correctly when outer wrapper flips
          borderRadius: '16px',
          background: 'rgba(15, 15, 20, 0.95)',
          backdropFilter: 'blur(15px)',
          border: '1px solid var(--accent-purple)',
          boxShadow: '0 15px 40px -10px rgba(170, 59, 255, 0.4)',
          padding: '2rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
            <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '1rem', lineHeight: 1.2 }}>{project.title}</h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
              {project.description}
            </p>

            <h4 style={{ color: 'var(--text-primary)', marginBottom: '1rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Tech Specs</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
              {project.tech.map(t => (
                <span key={t} style={{
                  fontSize: '0.75rem', color: '#fff', background: 'rgba(170, 59, 255, 0.2)',
                  padding: '0.3rem 0.6rem', borderRadius: '4px'
                }}>
                  {t}
                </span>
              ))}
            </div>

            <motion.a 
              href={project.link}
              target="_blank"
              onClick={(e) => e.stopPropagation()} // Prevent card mapping un-flip when clicking link
              whileHover={{ scale: 1.05, background: 'var(--accent-cyan)', color: '#000' }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.8rem 1.5rem', background: 'transparent',
                border: '1px solid var(--accent-cyan)', borderRadius: '30px',
                color: 'var(--accent-cyan)', fontSize: '1rem', textDecoration: 'none', fontWeight: 600,
                transition: 'all 0.3s ease'
              }}
            >
               Visit Project <ExternalLink size={18} />
            </motion.a>
        </div>

      </motion.div>
    </motion.div>
  );
}
