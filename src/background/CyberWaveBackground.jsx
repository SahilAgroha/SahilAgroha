import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class CyberWaveClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.plane = null;
        this.particles = null;
        this.geometry = null;
        this.initialPositions = null;
        this.orbs = [];
        
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
        // Extremely dark cool background space
        this.scene.background = new THREE.Color(0x030308);
        this.scene.fog = new THREE.FogExp2(0x030308, 0.0012);

        this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 4000);
        this.camera.position.set(0, 120, 400);
        this.camera.lookAt(0, 50, 0);

        // --- THE DIGITAL OCEAN (Wireframe Terrain) ---
        // 3000x3000 plane with 80x80 segments
        this.geometry = new THREE.PlaneGeometry(3000, 3000, 80, 80);
        this.geometry.rotateX(-Math.PI / 2);
        
        // Save initial vertices to calculate organic waves based on flat positions
        this.initialPositions = Float32Array.from(this.geometry.attributes.position.array);

        // Vibrant Cyan/Blue wireframe material
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x0ea5e9, 
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        this.plane = new THREE.Mesh(this.geometry, wireframeMaterial);
        
        // We also add glowing nodes at every vertex
        const nodeMaterial = new THREE.PointsMaterial({
            color: 0xd946ef, // Vibrant Pink/Fuchsia nodes
            size: 3,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true,
            depthWrite: false
        });
        
        this.particles = new THREE.Points(this.geometry, nodeMaterial);
        
        const oceanGroup = new THREE.Group();
        oceanGroup.add(this.plane);
        oceanGroup.add(this.particles);
        // Shift ocean slightly downward
        oceanGroup.position.y = -80;
        this.scene.add(oceanGroup);

        // --- BACKGROUND GLOWING ORBS (Aurora/Gradient Sky Feel) ---
        // These giant blurred spheres sit in the background to simulate a beautiful glowing gradient sky
        const orbGeom = new THREE.SphereGeometry(300, 32, 32);
        
        const orbColors = [
            { color: 0x0ea5e9, x: -600, y: 150, z: -800 }, // Blue
            { color: 0xd946ef, x: 500, y: 200, z: -1000 }, // Pink
            { color: 0x8b5cf6, x: 0, y: 300, z: -1200 },   // Purple
        ];

        orbColors.forEach((data) => {
            const mat = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.12,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(orbGeom, mat);
            mesh.position.set(data.x, data.y, data.z);
            // We scale up significantly
            mesh.scale.setScalar(2);
            this.scene.add(mesh);
            this.orbs.push({ mesh, baseX: data.x, baseY: data.y, speed: Math.random() * 0.5 + 0.2 });
        });

        // --- RENDERER ---
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
            this.windowHalfX = window.innerWidth / 2;
            this.windowHalfY = window.innerHeight / 2;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        document.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();
        const delta = this.clock.getDelta();

        // 1. ANIMATE THE DIGITAL OCEAN WAITING
        const positions = this.geometry.attributes.position.array;
        // We modify the Y coordinate of the flat plane (which is the [i+1] index)
        for (let i = 0; i < positions.length; i += 3) {
            const x = this.initialPositions[i];
            const z = this.initialPositions[i + 2];
            
            // Mix of three sine waves for a complex organic fluid movement
            // Wave 1: Broad side-to-side sweeping wave
            const wave1 = Math.sin(x * 0.002 + time * 0.5) * 40;
            // Wave 2: Forward-moving smaller ripples
            const wave2 = Math.sin(z * 0.003 + time * 0.8) * 30;
            // Wave 3: Circular ripples radiating outward
            const dist = Math.sqrt(x*x + z*z);
            const wave3 = Math.cos(dist * 0.005 - time * 1.5) * 20;

            positions[i + 1] = wave1 + wave2 + wave3;
        }
        this.geometry.attributes.position.needsUpdate = true;

        // 2. DRIFT THE BACKGROUND ORBS SLIGHTLY
        this.orbs.forEach((orb, index) => {
            // Orbs float gently in organic figure-8 patterns
            orb.mesh.position.y = orb.baseY + Math.sin(time * orb.speed) * 40;
            orb.mesh.position.x = orb.baseX + Math.cos(time * orb.speed * 0.8) * 60;
        });

        // 3. SMOOTH CAMERA INTERACTION
        // The camera glides side to side and slightly up/down based on mouse
        const targetCamX = this.mouseX * 300;
        const targetCamY = 120 + (this.mouseY * 80);
        
        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.02;
        this.camera.lookAt(0, 50, -200);

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

export default function CyberWaveBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new CyberWaveClass(containerRef.current);

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
