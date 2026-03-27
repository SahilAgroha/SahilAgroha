import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class AbstractCoreClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.coreGroup = null;
        this.dust = null;
        
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
        // Rich dark background
        this.scene.background = new THREE.Color(0x06060a);
        this.scene.fog = new THREE.FogExp2(0x06060a, 0.001);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 2000);
        this.camera.position.set(0, 0, 650);

        this.coreGroup = new THREE.Group();
        this.scene.add(this.coreGroup);

        // --- THE CENTERPIECE CORE (Torus Knot) ---
        // A complex mathematical shape that looks incredibly premium and techy
        const knotGeometry = new THREE.TorusKnotGeometry(120, 35, 300, 60);

        // Layer 1: Point Cloud (The inner glowing sand)
        const pointsMat = new THREE.PointsMaterial({
            color: 0x0ea5e9, // Bright Sky Blue
            size: 1.5,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const pointsMesh = new THREE.Points(knotGeometry, pointsMat);
        this.coreGroup.add(pointsMesh);

        // Layer 2: Wireframe (The outer tech grid)
        const wireMat = new THREE.MeshBasicMaterial({
            color: 0xd946ef, // Vibrant Purple/Pink
            wireframe: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const wireMesh = new THREE.Mesh(knotGeometry, wireMat);
        wireMesh.scale.setScalar(1.02); // Slightly larger to encompass points
        this.coreGroup.add(wireMesh);

        // Layer 3: Inner Core Glow
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6, // Deep Violet
            transparent: true,
            opacity: 0.2,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const glowSphere = new THREE.Mesh(new THREE.SphereGeometry(110, 32, 32), glowMat);
        this.coreGroup.add(glowSphere);

        // --- AMBIENT DUST PARTICLES ---
        // Creates depth and motion around the core
        const dustGeom = new THREE.BufferGeometry();
        const dustCount = 4000;
        const dustPos = new Float32Array(dustCount * 3);
        const radius = 1000;

        for (let i = 0; i < dustCount * 3; i += 3) {
            dustPos[i] = (Math.random() - 0.5) * radius * 1.5;
            dustPos[i + 1] = (Math.random() - 0.5) * radius * 1.5;
            dustPos[i + 2] = (Math.random() - 0.5) * radius * 2;
        }
        dustGeom.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
        
        const dustMat = new THREE.PointsMaterial({
            color: 0x10b981, // Emerald Green Accents
            size: 2,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending,
            sizeAttenuation: true
        });
        
        this.dust = new THREE.Points(dustGeom, dustMat);
        this.scene.add(this.dust);

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
        const delta = this.clock.getDelta();

        // 1. ROTATE THE CORE & DUST
        this.coreGroup.rotation.x += 0.003;
        this.coreGroup.rotation.y += 0.005;

        this.dust.rotation.y -= 0.001;
        this.dust.rotation.x -= 0.0005;

        // 2. BREATHING EFFECT (Scaling the core in and out softly like a heart)
        const scale = 1 + Math.sin(time * 1.5) * 0.04;
        this.coreGroup.scale.set(scale, scale, scale);

        // 3. SMOOTH CAMERA PARALLAX
        // The camera tracks the mouse slightly, letting you look around the core
        const targetCamX = this.mouseX * 150;
        const targetCamY = this.mouseY * 150;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.02;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.02;
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

export default function AbstractCoreBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new AbstractCoreClass(containerRef.current);

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
