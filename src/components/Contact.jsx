import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, Code, MessageSquare, ArrowRight } from 'lucide-react';
import { personal } from '../data/portfolioData';

export default function Contact() {
  const contacts = [
    { icon: <Mail size={22} />, label: 'Email', value: personal.email, href: `mailto:${personal.email}`, accent: 'var(--blue)' },
    { icon: <Phone size={22} />, label: 'Phone', value: personal.phone, href: `tel:${personal.phone.replace(/\s/g,'')}`, accent: 'var(--amber)' },
  ];

  const socials = [
    { icon: <Github size={20} />, label: 'GitHub', href: personal.github, value: 'github.com/SahilAgroha' },
    { icon: <Linkedin size={20} />, label: 'LinkedIn', href: personal.linkedin, value: 'linkedin.com/in/sahilagroha' },
    { icon: <Code size={20} />, label: 'LeetCode', href: personal.leetcode, value: 'leetcode.com/u/sahilagroha' },
  ];

  return (
    <section id="contact">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '3.5rem' }}
        >
          <span className="section-label" style={{ margin: '0 auto 1.2rem' }}><MessageSquare size={13} /> Contact</span>
          <h2 className="section-heading" style={{ textAlign: 'center' }}>
            Let's <span className="gradient-text">Work Together</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.7, maxWidth: 520, margin: '0.5rem auto 0' }}>
            I'm always open to discussing new projects, creative ideas, or opportunities. Drop me a line!
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem', maxWidth: 820, margin: '0 auto 2rem' }}>
          {contacts.map(({ icon, label, value, href, accent }, i) => (
            <motion.a
              key={label}
              href={href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', textDecoration: 'none', color: 'var(--text-primary)', borderColor: `${accent}30` }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: `${accent}15`, border: `1px solid ${accent}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent }}>
                {icon}
              </div>
              <div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>{label}</p>
                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{value}</p>
              </div>
              <ArrowRight size={17} style={{ marginLeft: 'auto', color: accent, opacity: 0.5 }} />
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: 820, margin: '0 auto 4rem' }}
        >
          {socials.map(({ icon, label, href, value }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="card"
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--text-secondary)', padding: '0.75rem 1.25rem', flexShrink: 0, transition: 'color 0.2s ease, border-color 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--blue-light)'; e.currentTarget.style.borderColor = 'var(--border-accent)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
            >
              {icon}
              <span style={{ fontSize: '0.88rem', fontWeight: 500 }}>{value}</span>
            </a>
          ))}
        </motion.div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Designed & built by <strong style={{ color: 'var(--blue)' }}>{personal.name}</strong> · {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}
