import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Section3D({ children, animationType = 'tilt' }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;
    
    // Get the element's actual position on the screen
    const rect = ref.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    
    // Calculate the center of the element relative to the center of the viewport
    const elementCenter = rect.top + rect.height / 2;
    const screenCenter = windowHeight / 2;
    
    // Normalized distance from the center (-1 to 1)
    const n = (elementCenter - screenCenter) / (windowHeight / 2);
    
    // Opacity fades out faster at edges
    let opacity = 1 - Math.abs(n) * 1.5; 
    if (opacity < 0) opacity = 0;
    if (opacity > 1) opacity = 1;

    let rotateX = 0;
    let rotateY = 0;
    let rotateZ = 0;
    let translateX = 0;
    let translateZ = 0;
    let scale = 1;

    // Apply unique cinematic 3D transformations dynamically based on scroll distance
    if (animationType === 'tilt') {
      rotateX = n * -45;
      translateZ = -Math.abs(n) * 600;
      scale = 1 - Math.abs(n) * 0.15;
    } else if (animationType === 'slideLeft') {
      translateX = n * 50; // vw units
      rotateY = n * 45;
      translateZ = -Math.abs(n) * 300;
      scale = 1 - Math.abs(n) * 0.1;
    } else if (animationType === 'zoom') {
      translateZ = n * -1200;
      rotateX = n * -10;
      scale = 1 - Math.abs(n) * 0.3;
    } else if (animationType === 'spin') {
      rotateZ = n * 45;
      scale = 1 - Math.abs(n) * 0.3;
      translateZ = -Math.abs(n) * 400;
    } else if (animationType === 'flip') {
      rotateY = n * -90;
      translateZ = -Math.abs(n) * 500;
      scale = 1 - Math.abs(n) * 0.2;
    }

    ref.current.style.opacity = opacity.toFixed(3);
    ref.current.style.transform = `perspective(1200px) translate3d(${translateX}vw, 0, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
  });

  return (
    <div 
      ref={ref} 
      style={{ 
        width: '100%', 
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity',
        zIndex: 10
      }}
    >
      {children}
    </div>
  );
}
