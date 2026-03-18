import React, { useRef } from "react";
import { motion } from "framer-motion";
import { useFrame } from "@react-three/fiber";
import { Rocket } from "lucide-react";

const timelineData = [
  {
    title: "System Architecture",
    text: "Strong understanding of System Design basics for building robust scalable backends.",
    type: "skill",
  },
  {
    title: "Scalable Projects",
    text: "🔥 Focus on real-world scalable projects with complex requirements and load.",
    type: "highlight",
  },
  {
    title: "Distributed Systems",
    text: "Experience with Microservices concepts for separated, scalable logic frameworks.",
    type: "skill",
  },
  {
    title: "Backend & Frontend",
    text: "🎯 Strong backend + frontend combination for complete end-to-end product delivery.",
    type: "highlight",
  },
  {
    title: "Real-Time Data",
    text: "Knowledge of Real-time systems (Kafka, Websockets) for instant data synchronization.",
    type: "skill",
  },
  {
    title: "Advanced UI",
    text: "💡 Always exploring advanced UI, 3D math, and animations for immersive experiences.",
    type: "highlight",
  },
  {
    title: "DevOps & Tooling",
    text: "Familiar with essential DevOps tools including Docker for containerization and Redis.",
    type: "skill",
  },
  {
    title: "Performance & Security",
    text: "⚡ Strict performance footprint and security-oriented development patterns.",
    type: "highlight",
  },
];

export default function Experience() {
  const containerRef = useRef();
  const lineRef = useRef();
  const avatarRef = useRef();

  useFrame((state) => {
    if (!containerRef.current || !lineRef.current || !avatarRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Progress starts when the top of the section reaches 40% of the screen height
    const startTrigger = windowHeight * 0.4;
    const distanceScrolled = startTrigger - rect.top;
    const totalHeight = rect.height;

    // Normalize progress between 0 and 1
    let progress = distanceScrolled / totalHeight;
    progress = Math.max(0, Math.min(1, progress));

    lineRef.current.style.height = `${progress * 100}%`;

    // Add a slight bobbing math function to the avatar so it looks "alive" while traveling
    const bobbing = Math.sin(state.clock.elapsedTime * 4) * 5;
    avatarRef.current.style.transform = `translate(-50%, ${bobbing}px)`;
  });

  return (
    <section
      ref={containerRef}
      id="experience"
      style={{ minHeight: "200vh", position: "relative", padding: "5rem 0" }}
    >
      <motion.h2
        animate={{ y: [0, -15, 0], rotateZ: [0, -3, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          fontSize: "3.5rem",
          marginBottom: "8rem",
          textAlign: "center",
          fontWeight: 900,
          background: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        My Journey
      </motion.h2>

      <div
        style={{
          position: "relative",
          maxWidth: "1000px",
          margin: "0 auto",
          height: "100%",
        }}
      >
        {/* The Central Dim Track */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: "4px",
            background: "rgba(255,255,255,0.05)",
            transform: "translateX(-50%)",
            borderRadius: "4px",
          }}
        />

        {/* The Active Glowing Timeline Progress Line */}
        <div
          ref={lineRef}
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "4px",
            background:
              "linear-gradient(to bottom, var(--accent-cyan), var(--accent-purple))",
            transform: "translateX(-50%)",
            height: "0%", // Mutated by useFrame
            boxShadow: "0 0 20px var(--accent-purple)",
            borderRadius: "4px",
            willChange: "height",
          }}
        >
          {/* The Animated Person / Avatar riding the tip of the line! */}
          <div
            ref={avatarRef}
            style={{
              position: "absolute",
              bottom: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "45px",
              height: "45px",
              background: "#050505",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid var(--accent-cyan)",
              boxShadow: "0 0 25px var(--accent-cyan)",
              willChange: "transform",
            }}
          >
            <Rocket size={22} color="var(--accent-cyan)" />
          </div>
        </div>

        {/* Timeline Items Placed Alternating Left/Right */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 10,
          }}
        >
          {timelineData.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={index}
                style={{ marginTop: index > 0 ? "-3.5rem" : "0" }}
              >
                <TimelineItem item={item} isLeft={isLeft} index={index} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function TimelineItem({ item, isLeft, index }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: isLeft ? -100 : 100,
        rotateY: isLeft ? -30 : 30,
      }}
      whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      style={{
        display: "flex",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        width: "100%",
        padding: "0 2rem",
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "45%",
          position: "relative",
          padding: "2rem",
          borderLeft: isLeft
            ? "none"
            : `4px solid ${item.type === "skill" ? "var(--accent-cyan)" : "var(--accent-purple)"}`,
          borderRight: isLeft
            ? `4px solid ${item.type === "skill" ? "var(--accent-cyan)" : "var(--accent-purple)"}`
            : "none",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <h3
          style={{
            fontSize: "1.4rem",
            color: "#fff",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          {item.title}
        </h3>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1.05rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          {item.text}
        </p>

        {/* Connection node glowing point mapping to the center timeline */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: index * 0.2 }}
          style={{
            position: "absolute",
            top: "50%",
            [isLeft ? "right" : "left"]: "-2.2rem",
            transform: "translateY(-50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            background: "var(--bg-secondary)",
            border: `4px solid ${item.type === "skill" ? "var(--accent-cyan)" : "var(--accent-purple)"}`,
            boxShadow: `0 0 15px ${item.type === "skill" ? "var(--accent-cyan)" : "var(--accent-purple)"}`,
            zIndex: 1,
          }}
        />
      </div>
    </motion.div>
  );
}
