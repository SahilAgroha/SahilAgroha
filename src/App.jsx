import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls, Scroll } from '@react-three/drei';
import CinematicScene from './components/CinematicScene';
import Section3D from './components/Section3D';
import Hero from './components/Hero';
import About from './components/About';
import TechStack from './components/TechStack';
import Projects from './components/Projects';
import Experience from './components/Experience';
import Contact from './components/Contact';
import ResumeButton from './components/ResumeButton';
import LoadingScreen from './components/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [mountApp, setMountApp] = useState(false);

  // Separate the initial paint thread from heavy WebGL payload instantiation
  useEffect(() => {
    // 1. Let the Loading CSS boot instantly, wait 500ms, then silently start mounting WebGL 
    const mountTimer = setTimeout(() => {
      setMountApp(true);
    }, 500);

    // 2. Hold the loading door locked for a strict 5000ms
    const loadingTimer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => {
      clearTimeout(mountTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505', position: 'relative' }}>
      
      <LoadingScreen isLoading={isLoading} />
      
      {/* Underlying DOM graphs and heavy ThreeJS strictly deferred until thread allows */ }
      {mountApp && (
        <>
          <ResumeButton />
          <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <Suspense fallback={null}>
          <ScrollControls pages={7.28} damping={0.25}>
            
            {/* 3D Cinematic Flight Scene */}
            <CinematicScene />

            {/* DOM Overlay locked to scroll */}
            <Scroll html style={{ width: '100%' }}>
              <div className="content-overlay">
                <Section3D animationType="zoom"><Hero /></Section3D>
                <Section3D animationType="slideLeft"><About /></Section3D>
                <Section3D animationType="flip"><TechStack /></Section3D>
                <Section3D animationType="tilt"><Projects /></Section3D>
                <Experience />
                <Contact />
              </div>
            </Scroll>
            
          </ScrollControls>
        </Suspense>
      </Canvas>
      </>
      )}
    </div>
  );
}

export default App;
