import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

function MovingStars() {
  const group = useRef();

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.05;
      group.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <group ref={group}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  );
}

export default function Background3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1] }}
      style={{ background: '#050505' }} // match root bg
    >
      <ambientLight intensity={0.5} />
      <MovingStars />
    </Canvas>
  );
}
