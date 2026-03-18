import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg' },
  { name: 'JavaScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg' },
  { name: 'HTML5', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg' },
  { name: 'CSS3', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg' },
  { name: 'Tailwind CSS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
  { name: 'Three.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg' },
  { name: 'Java', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg' },
  { name: 'Spring Boot', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg' },
  { name: 'MySQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg' },
  { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/redis/redis-original.svg' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg' },
  { name: 'Kafka', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/apachekafka/apachekafka-original.svg' }
];

export default function TechStack() {
  return (
    <section id="tech-stack" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{ width: '100%' }}
      >
        <h2 style={{ fontSize: '3rem', marginBottom: '3rem', fontWeight: 800, textAlign: 'center' }}>
          <span style={{ 
            background: 'linear-gradient(45deg, #00f2fe, #4facfe)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>Tech Stack</span>
        </h2>
      </motion.div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        alignItems: 'center',
        gap: '2.5rem', 
        maxWidth: '1000px', 
        margin: '0 auto',
        padding: '2rem 1rem'
      }}>
        {skills.map((skill, index) => {
          // Generate a smooth organic float offset for the "freely flow" effect
          const duration = 3 + Math.random() * 2;
          const delay = Math.random() * 2;
          const yFloat = Math.random() * 8 + 5;
          const xFloat = (Math.random() - 0.5) * 8;

          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              animate={{ 
                y: [0, -yFloat, 0],
                x: [0, xFloat, 0]
              }}
              transition={{ 
                opacity: { duration: 0.5, delay: index * 0.1 },
                scale: { type: 'spring', damping: 10, stiffness: 100, delay: index * 0.1 },
                y: { duration: duration, repeat: Infinity, ease: 'easeInOut', delay: delay },
                x: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut', delay: delay }
              }}
              whileHover={{ scale: 1.1, zIndex: 10 }}
              style={{ 
                position: 'relative',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                width: '140px', height: '140px', borderRadius: '50%', // Explicit perfect circle shape
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                overflow: 'hidden'
              }}
            >
              {/* Spinning gradient background layer creating the "moving circle contour line" */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
                  background: 'conic-gradient(from 0deg, transparent 0%, transparent 60%, #00f0ff 80%, #9d4edd 100%)',
                  zIndex: 0,
                }}
              />
              
              {/* Inner dark container leaving ONLY a strictly 2px animated circular border exposed */}
              <div style={{
                position: 'absolute', inset: '2px', background: 'rgba(15, 15, 20, 0.95)', borderRadius: '50%', zIndex: 1
              }} />

              {/* Foreground content strictly constrained to zIndex 2 */}
              <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <img src={skill.icon} alt={skill.name} style={{ width: '45px', height: '45px', filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.3))' }} />
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#e0e0e0', letterSpacing: '0.5px', textAlign: 'center' }}>{skill.name}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

    </section>
  );
}
