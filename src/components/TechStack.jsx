import React from 'react';
import { motion } from 'framer-motion';
import { techCategories } from '../data/portfolioData';
import SkillSphere from './SkillSphere';

const allSkills = techCategories.flatMap(e => e.skills);

export default function TechStack() {
  return (
    <section id="tech-stack" style={{ overflow: 'hidden', padding: '10rem 0' }}>
      <div className="container" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="section-label">Capabilities</span>
          <h2
            className="section-heading"
            style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1rem' }}
          >
            My 
            <span className="gradient-text" style={{ marginLeft: '1.8rem' }}>Skill</span>
          </h2>
        </motion.div>
      </div>

      <div
        style={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <SkillSphere skills={allSkills} />
      </div>
    </section>
  );
}