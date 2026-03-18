import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, useGLTF, Trail } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Universal mathematical function linking the generative Road and the Car Controller.
 */
export const getPathParams = (progress) => {
  const z = -progress * 400; 
  const x = Math.sin(progress * Math.PI * 6) * 15 + Math.sin(progress * Math.PI * 2.5) * 8;
  return new THREE.Vector3(x, 0, z);
};

export default function Character() {
  const group = useRef();
  const carPivot = useRef();
  const wheelsRef = useRef([]);
  const scroll = useScroll();

  // Load the authentic photorealistic GLB via robust JSDelivr mirror
  const { scene } = useGLTF('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/ferrari.glb');

  // Paint the car Silver dynamically and extract Wheel pivots for kinematic tire rotation!
  const carModel = useMemo(() => {
    wheelsRef.current = [];
    const clone = scene.clone();
    clone.traverse((node) => {
      if (node.isMesh) {
         const n = node.name.toLowerCase();
         
         // Extract Wheels for infinite rolling animation array
         if (n.includes('wheel') || n.includes('tire') || n.includes('rim') || (node.material && node.material.name.toLowerCase().includes('tire'))) {
            wheelsRef.current.push(node);
         }
         
         const isGlass = n.includes('glass') || (node.material && node.material.name.toLowerCase().includes('glass')) || n.includes('wind');
         const isLight = n.includes('light') || n.includes('tail') || n.includes('brake') || (node.material && node.material.name.toLowerCase().includes('light'));
         const isWheel = n.includes('wheel') || n.includes('tire') || n.includes('rim');
         const isExhaust = n.includes('exhaust') || n.includes('pipe');

         // Aggressive brute-force metallic paint: If it's NOT a functional separate component, it MUST be the primary chassis/wings! Paint it Platinum!
         if (!isGlass && !isLight && !isWheel && !isExhaust) {
            node.material = new THREE.MeshPhysicalMaterial({
               color: '#f5f5f7', // Bright Silver / Platinum 
               metalness: 0.95, 
               roughness: 0.15, 
               clearcoat: 1.0,
               clearcoatRoughness: 0.05
            });
         }
         
         // Force tail logic if inherent in mesh (acting as a fallback to the procedural glowing orbs we injected)
         if (isLight && (n.includes('tail') || n.includes('rear') || n.includes('brake'))) {
             node.material = new THREE.MeshBasicMaterial({ color: '#ff0033' });
         }
      }
    });
    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    if (!group.current) return;
    
    // Strict clamp bounding to prevent out-of-bounds mathematically generated NaN anomalies
    const safeOffset = Math.max(0, Math.min(scroll.offset, 0.995));
    const current = getPathParams(safeOffset);
    const next = getPathParams(Math.min(safeOffset + 0.01, 1)); 
    
    // Smooth magnetic snapping to the procedurally generated synthwave track
    group.current.position.copy(current);
    group.current.lookAt(next);
    
    if (carPivot.current) {
        carPivot.current.rotation.set(0, 0, 0);
    }
    
    // Calculate and apply localized Wheel Rotation physics over the X-axis for realistic driving
    if (wheelsRef.current.length > 0) {
        // Tie rot velocity directly to the frame rate delta to prevent varying spin rates
        const spinVelocity = 12 * delta; 
        wheelsRef.current.forEach((wheel) => {
             wheel.rotation.x -= spinVelocity;
        });
    }
  });

  return (
    <group ref={group}>
      <group ref={carPivot}>
        
        {/* Photorealistic GLTF Model */}
        {/* Scale 1.5 multiplier manually applied over the native 4-meter WebGL footprint. Rotation Math.PI explicitly points it facing into -Z. */}
        <primitive object={carModel} scale={1.5} position={[0, -0.6, 0]} rotation={[0, Math.PI, 0]} />
        
        {/* Headlights casting dynamic volumetric cones into the darkness */}
        <spotLight position={[0.6, 0.2, -2.5]} angle={0.5} penumbra={0.3} intensity={5} color="#ccffff" distance={40} castShadow />
        <spotLight position={[-0.6, 0.2, -2.5]} angle={0.5} penumbra={0.3} intensity={5} color="#ccffff" distance={40} castShadow />
        
        {/* Physical localized intense Glowing Taillight proxy orbs mounted explicitly to the rear bumper curve */}
        <mesh position={[0.7, 0.35, 3.2]}>
           <sphereGeometry args={[0.08, 16, 16]} />
           <meshBasicMaterial color="#ff0033" />
        </mesh>
        <mesh position={[-0.7, 0.35, 3.2]}>
           <sphereGeometry args={[0.08, 16, 16]} />
           <meshBasicMaterial color="#ff0033" />
        </mesh>

        {/* Global Brakelight Environmental Bloom */}
        <pointLight position={[0.7, 0.35, 3.2]} intensity={4} color="#ff0033" distance={8} />
        <pointLight position={[-0.7, 0.35, 3.2]} intensity={4} color="#ff0033" distance={8} />
        
        {/* Cyberpunk Ground-Effect Underglow */}
        <pointLight position={[0, -0.6, 0]} intensity={5} color="#9d4edd" distance={10} />
        
        {/* Spectacular Long-Exposure Cinematic Timelapse Trails mapped structurally directly out of the Taillight Meshes! */}
        <Trail width={2} length={12} color="#ff0033" attenuation={(t) => t * t}>
           {/* Invisible tracker bridging the trail emission to the Left Taillight */}
           <mesh position={[-0.7, 0.35, 3.3]}><sphereGeometry args={[0.01]} /><meshBasicMaterial transparent opacity={0}/></mesh>
        </Trail>
        <Trail width={2} length={12} color="#ff0033" attenuation={(t) => t * t}>
           {/* Invisible tracker bridging the trail emission to the Right Taillight */}
           <mesh position={[0.7, 0.35, 3.3]}><sphereGeometry args={[0.01]} /><meshBasicMaterial transparent opacity={0}/></mesh>
        </Trail>

      </group>
    </group>
  );
}

// Prefetch the highly-detailed mesh through the active raw GitHub mirror pipeline
useGLTF.preload('https://cdn.jsdelivr.net/gh/mrdoob/three.js@master/examples/models/gltf/ferrari.glb');
