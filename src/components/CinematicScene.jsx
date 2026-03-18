import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Line, Grid, Stars } from '@react-three/drei';
import * as THREE from 'three';
import Character, { getPathParams } from './Character';

export default function CinematicScene() {
  const scroll = useScroll();
  const cameraTarget = useRef(new THREE.Vector3());

  // Generate continuous procedural road geometries mapping explicitly to the car's slalom driver algorithm
  const roadPoints = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 500; i++) {
      pts.push(getPathParams(i / 500));
    }
    return pts;
  }, []);

  useFrame((state) => {
    const safeOffset = Math.max(0, Math.min(scroll.offset, 0.99));
    
    // Acquire the true coordinate of the racing vehicle
    const carPos = getPathParams(safeOffset);
    
    // Configure follow-camera to lock strictly behind and over the trunk of the vehicle drone-style
    const camX = carPos.x;
    const camY = 3.5;  
    const camZ = carPos.z + 14; 
    
    // Smooth cinematic trailing logic mimicking physical camera gimbal inertia
    cameraTarget.current.lerp(new THREE.Vector3(camX, camY, camZ), 0.08);
    state.camera.position.copy(cameraTarget.current);
    
    // Orient the camera lens to stare piercingly down the road slightly ahead of the drifting bumper
    const lookAhead = getPathParams(Math.min(safeOffset + 0.02, 1));
    state.camera.lookAt(lookAhead.x, lookAhead.y + 1, lookAhead.z - 5);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[15, 20, 10]} intensity={1.5} color="#9d4edd" />

      {/* 
        ================================================================
        SYNTHWAVE INFINITE HIGHWAY BASE
        ================================================================
      */}
      {/* Underlying Cyberpunk Grid Environment */}
      <Grid 
        position={[0, -1.0, 0]} 
        args={[300, 1500]} 
        cellSize={2} 
        cellThickness={1.5} 
        cellColor="#9d4edd" 
        sectionSize={10} 
        sectionThickness={3} 
        sectionColor="#00f0ff" 
        fadeDistance={300} 
        infiniteGrid 
      />

      {/* Extreme Neon Path Routing Boundary Lasers */}
      <RoadEdge points={roadPoints} offsetX={-4.5} color="#00f0ff" />
      <RoadEdge points={roadPoints} offsetX={4.5} color="#ff0055" />
      
      {/* Piercing Center Highway Dash Dividers */}
      <RoadEdge points={roadPoints} offsetX={0} color="#ffffff" dashed />

      {/* Hyper-speed Parallax Starfield */}
      <Stars radius={150} depth={80} count={6000} factor={5} saturation={0} fade speed={2} />

      {/* Render the procedurally scrolling Racing Controller */}
      <Character />
    </>
  );
}

// Procedural Spline Generation translating points into neon bounding strips
function RoadEdge({ points, offsetX, color, dashed = false }) {
  const edgePoints = useMemo(() => {
    return points.map(p => new THREE.Vector3(p.x + offsetX, -0.9, p.z)); // Firmly glued above the grid layout
  }, [points, offsetX]);

  return (
    <Line 
      points={edgePoints} 
      color={color} 
      lineWidth={dashed ? 4 : 7}
      dashed={dashed}
      dashSize={4}
      gapSize={6}
    />
  );
}
