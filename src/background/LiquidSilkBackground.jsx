import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class LiquidSilkClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.plane = null;
        this.geometry = null;
        this.initialPos = null;
        
        this.light1 = null;
        this.light2 = null;
        this.light3 = null;
        this.light4 = null;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.clock = new THREE.Clock();
        this.animationId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        // Very deep, almost black background to let the lights pop
        this.scene.background = new THREE.Color(0x020204);

        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 0, 1000);

        // --- THE METALLIC SILK CANVAS ---
        // A high-res plane. 80x60 segments = 4800 vertices
        // Large enough to cover the screen
        this.geometry = new THREE.PlaneGeometry(3500, 2000, 80, 60);
        
        // Save initial positions to use in our math
        this.initialPos = Float32Array.from(this.geometry.attributes.position.array);

        // A beautiful highly-reflective material.
        // It's mostly black but highly polished, so it purely reflects the colored point lights.
        // A beautiful highly-reflective material using Phong to avoid needing an Environment Map
        const material = new THREE.MeshPhongMaterial({
            color: 0x111115,       // Dark base tone
            specular: 0xffffff,    // Bright highlights
            shininess: 80,         // Glossy silk finish
            side: THREE.DoubleSide
        });

        this.plane = new THREE.Mesh(this.geometry, material);
        // Tilt the canvas back slightly so it feels like a wall curling into a floor
        this.plane.rotation.x = -Math.PI * 0.1;
        this.scene.add(this.plane);

        // --- DYNAMIC COLORED LIGHTS ---
        // These lights will sweep across the canvas, transferring their colors onto the metallic silk
        this.light1 = new THREE.PointLight(0x0ea5e9, 1000, 2500); // Sky Blue
        this.light2 = new THREE.PointLight(0xd946ef, 1000, 2500); // Fuchsia / Pink
        this.light3 = new THREE.PointLight(0x10b981, 1000, 2500); // Emerald Green
        this.light4 = new THREE.PointLight(0xf59e0b, 1000, 2500); // Amber / Orange

        this.scene.add(this.light1);
        this.scene.add(this.light2);
        this.scene.add(this.light3);
        this.scene.add(this.light4);

        // A faint ambient light so shadows aren't pitch black
        const ambientLight = new THREE.AmbientLight(0x1a1a2e, 1.5);
        this.scene.add(ambientLight);

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

        // 1. ANIMATE THE SILK CANVAS (Vertices Deformation)
        const positions = this.geometry.attributes.position.array;
        let pIndex = 0;

        // Loop over vertices and apply overlapping sine waves
        for (let i = 0; i < positions.length; i += 3) {
            const x = this.initialPos[i];
            const y = this.initialPos[i + 1];

            // Wave 1: slow broad horizontal roll
            const wave1 = Math.sin(x * 0.0015 + time * 0.8) * 80;
            // Wave 2: diagonal faster ripple
            const wave2 = Math.cos((x + y) * 0.002 + time * 1.2) * 60;
            // Wave 3: vertical organic variance
            const wave3 = Math.sin(y * 0.003 - time * 0.6) * 50;

            // Apply displacement to Z
            positions[i + 2] = wave1 + wave2 + wave3;
        }

        this.geometry.attributes.position.needsUpdate = true;
        // Re-compute normals so the lights bounce beautifully off the new curved waves!
        this.geometry.computeVertexNormals();

        // 2. ANIMATE THE DANCING LIGHT ORBS
        // They orbit across the canvas in mesmerizing paths
        this.light1.position.set(
            Math.sin(time * 0.4) * 1200,
            Math.cos(time * 0.3) * 600,
            200 + Math.sin(time) * 100
        );
        this.light2.position.set(
            Math.cos(time * 0.35) * 1200,
            Math.sin(time * 0.5) * 600,
            200 + Math.cos(time) * 150
        );
        this.light3.position.set(
            Math.sin(time * 0.6) * 800,
            Math.cos(time * 0.45) * 800,
            250 + Math.sin(time * 0.8) * 120
        );
        this.light4.position.set(
            Math.cos(time * 0.25) * 1400,
            Math.sin(time * 0.3) * 500,
            300 + Math.sin(time * 0.5) * 80
        );

        // 3. SMOOTH CAMERA PARALLAX (Tracks the mouse)
        const targetCamX = this.mouseX * 150;
        const targetCamY = this.mouseY * 150 - 50;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.02;
        
        // Soft camera breathing
        this.camera.position.z = 1000 + Math.sin(time * 0.3) * 50;
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

export default function LiquidSilkBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new LiquidSilkClass(containerRef.current);

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
