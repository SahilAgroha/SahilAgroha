import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class NebulaGalaxyClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.stars = null;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.clock = new THREE.Clock();
        this.animationId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        // A very deep, premium blue-black background
        this.scene.background = new THREE.Color(0x030508);
        this.scene.fog = new THREE.FogExp2(0x030508, 0.0008);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 4000);
        // Positioned slightly above and looking slightly down toward the core
        this.camera.position.set(0, 250, 600);
        
        // --- GALAXY PARTICLES ---
        const particleCount = 20000;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // Brand colors (matches React/Next.js/Java developer vibe)
        const colorInside = new THREE.Color(0x3b82f6); // Vibrant Blue
        const colorOutside = new THREE.Color(0x8b5cf6); // Deep Purple
        const colorAccent = new THREE.Color(0x10b981); // Emerald Green Accent

        const branches = 5;
        const radius = 800;
        const spin = 1.2;
        const randomness = 0.4;
        const randomnessPower = 3.5;

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            // Radius: more particles near the center
            const r = Math.random() * radius;

            // Angle
            const spinAngle = r * spin;
            const branchAngle = ((i % branches) / branches) * Math.PI * 2;

            // Random dispersion
            const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
            const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

            positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
            positions[i3 + 1] = randomY * 0.4; // Flatten the galaxy vertically
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

            // Blended Color based on distance from center
            const mixedColor = colorInside.clone();
            mixedColor.lerp(colorOutside, r / radius);
            
            // Randomly sprinkle some accent colored particles
            if (Math.random() > 0.95) {
                mixedColor.lerp(colorAccent, 0.8);
            }

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 2.5,
            sizeAttenuation: true,
            depthWrite: false, // Prevents particles from occluding each other weirdly
            blending: THREE.AdditiveBlending, // Glow effect when they overlap
            vertexColors: true,
            transparent: true,
            opacity: 0.9
        });

        this.particles = new THREE.Points(geometry, material);
        // Tilt the galaxy slightly for character
        this.particles.rotation.x = Math.PI * 0.1;
        this.particles.rotation.z = Math.PI * -0.05;
        this.scene.add(this.particles);

        // --- DISTANT STARFIELD ---
        const starGeom = new THREE.BufferGeometry();
        const starPos = new Float32Array(1500 * 3);
        const starColors = new Float32Array(1500 * 3);
        
        for(let i = 0; i < 1500; i++) {
            starPos[i*3] = (Math.random() - 0.5) * 4000;
            starPos[i*3+1] = (Math.random() - 0.5) * 4000;
            starPos[i*3+2] = ((Math.random() - 0.5) * 4000) - 500; // push slightly back
            
            // Subtle twinkling colors for stars (mostly white/blue)
            const starVibe = new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.5, Math.random() * 0.8 + 0.2);
            starColors[i*3] = starVibe.r;
            starColors[i*3+1] = starVibe.g;
            starColors[i*3+2] = starVibe.b;
        }
        
        starGeom.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
        starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
        
        const starMat = new THREE.PointsMaterial({
            size: 1.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            sizeAttenuation: true
        });
        
        this.stars = new THREE.Points(starGeom, starMat);
        this.scene.add(this.stars);

        // Core Glow (A subtle gradient sphere at the center)
        const glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.08,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(150, 32, 32), glowMaterial);
        glowSphere.position.copy(this.particles.position);
        this.scene.add(glowSphere);

        // -- RENDERER --
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: "high-performance" });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        this.handleMouseMove = (event) => {
            // Normalized coordinates (-1 to 1)
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        this.handleResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        document.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        const elapsedTime = this.clock.getElapsedTime();

        // Slowly rotate the galaxy
        this.particles.rotation.y += 0.05 * delta;
        
        // And slowly pan the starfield the other way for depth illusion
        this.stars.rotation.y -= 0.01 * delta;

        // Smoothly interpolate the camera based on mouse movement
        // We calculate a target position
        const targetCamX = this.mouseX * 300;
        const targetCamY = 250 + (this.mouseY * 150);
        
        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.02;
        
        // Optional subtle floating effect (sine wave)
        this.camera.position.y += Math.sin(elapsedTime * 0.5) * 0.5;

        // Keep looking at the core
        this.camera.lookAt(0, 0, 0);

        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);

        if (this.container && this.renderer && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Cleanup geometries and materials
        if (this.scene) {
            this.scene.traverse((object) => {
                if (!object.isMesh && !object.isPoints && !object.isLine) return;
                
                if (object.geometry) object.geometry.dispose();
                
                if (object.material) {
                    if (object.material.isMaterial) {
                        object.material.dispose();
                    } else if (Array.isArray(object.material)) {
                        for (const material of object.material) {
                            material.dispose();
                        }
                    }
                }
            });
        }
    }
}

export default function NebulaGalaxyBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new NebulaGalaxyClass(containerRef.current);

        return () => {
            bg.destroy();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: -1,
                pointerEvents: 'none'
            }}
        />
    );
}
