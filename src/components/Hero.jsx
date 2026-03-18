import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2 } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        minHeight: "100vh",
        padding: "0 2rem",
        maxWidth: "1200px",
        margin: "0 auto"
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ 
           width: "100%", 
           maxWidth: "800px", 
           background: "rgba(5, 5, 10, 0.7)", 
           backdropFilter: "blur(16px)", 
           WebkitBackdropFilter: "blur(16px)",
           padding: "3rem", 
           borderRadius: "24px",
           border: "1px solid rgba(255,255,255,0.08)",
           boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 20px rgba(255,255,255,0.02)"
        }}
      >
        <h2
          style={{
            fontSize: "1.5rem",
            color: "var(--accent-purple)",
            marginBottom: "1rem",
            fontWeight: 500,
          }}
        >
          Hello, I'm
        </h2>
        
        {/* Name with Embedded Logo & Moving Random Gradient Box */}
        <div style={{ 
          position: 'relative', display: 'inline-block', marginBottom: '1.5rem', 
          borderRadius: '24px', overflow: 'hidden', padding: '5px' 
        }}>
           
           {/* Chaotic Random Moving Gradient Line */}
           <motion.div 
             animate={{ rotate: 360, scale: [1, 1.8, 0.7, 1.4, 1] }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             style={{
               position: 'absolute', top: '-50%', left: '-50%', width: '200%', height: '200%',
               background: 'conic-gradient(from 0deg, transparent 0%, transparent 40%, #00f0ff 50%, #e52e71 60%, transparent 100%)',
               zIndex: 0,
             }}
           />

           {/* Core background to punch out the center, leaving only the glowing border */}
           <div style={{ 
             position: 'relative', zIndex: 1, background: '#050505', 
             borderRadius: '20px', padding: '0.5rem 1.5rem' 
           }}>
             <motion.h1
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{
                fontSize: "clamp(4rem, 10vw, 7rem)",
                lineHeight: 1.1,
                fontWeight: 900,
                background: "linear-gradient(90deg, #ff8a00, #e52e71, #ff8a00)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: 'flex',
                alignItems: 'center',
                margin: 0
              }}
            >
               S
              <Code2 
                size={"clamp(3.5rem, 8vw, 6rem)"} 
                color="#00f0ff" 
                strokeWidth={2.5}
                style={{ margin: '0 8px', filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.7))' }} 
              />
              hil 
            </motion.h1>
           </div>
        </div>

        {/* Typewriter Changing Subtitle */}
        <div style={{ marginBottom: "2rem", minHeight: "3.5rem" }}>
          <TypewriterText roles={["Software Engineer", "Full Stack Developer"]} />
        </div>

        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            lineHeight: 1.6,
            marginBottom: "1rem", 
          }}
        >
          I am a passionate Full Stack Developer specializing in building scalable web applications using Spring Boot and React. I love turning ideas into impactful digital products with modern UI/UX.
        </p>

      </motion.div>
    </section>
  );
}

// Left-Aligned Typewriter Component
function TypewriterText({ roles }) {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!roles || roles.length === 0) return;
    const role = roles[currentRoleIndex];
    let typingSpeed = isDeleting ? 30 : 100;

    if (!isDeleting && currentText === role) {
      typingSpeed = 2500; 
      setTimeout(() => setIsDeleting(true), typingSpeed);
      return;
    }

    if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
      typingSpeed = 500; 
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText(
        isDeleting
          ? role.substring(0, currentText.length - 1)
          : role.substring(0, currentText.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentRoleIndex, roles]);

  return (
    <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 3rem)", lineHeight: 1.2, fontWeight: 700, margin: 0, color: "#e0e0e0" }}>
      I am a <span style={{ color: "var(--accent-cyan)", filter: "drop-shadow(0 0 8px rgba(0,240,255,0.4))" }}>{currentText}</span>
      <motion.span 
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        style={{ 
          display: 'inline-block', width: '3px', height: '1em', background: 'var(--accent-purple)', 
          marginLeft: '4px', verticalAlign: 'middle', transform: 'translateY(-2px)' 
        }}
      />
    </h2>
  );
}
