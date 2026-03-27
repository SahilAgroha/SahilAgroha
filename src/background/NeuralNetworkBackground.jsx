import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class NeuralNetworkClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.linesMesh = null;
        
        this.particleData = [];
        this.particlePositions = null;
        this.linesGeometry = null;
        this.particlesGeometry = null;
        this.positions = null;
        this.colors = null;
        
        this.particleCount = 350;
        this.r = 600; // Radius for scattering
        this.maxConnectionDistance = 75;
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
        
        this.animationId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        // A very dark background for the high contrast neural aesthetic
        this.scene.background = new THREE.Color(0x0a0a0d);
        this.scene.fog = new THREE.Fog(0x0a0a0d, 400, 1000);

        this.camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            1,
            2000
        );
        this.camera.position.z = 800;

        // Group everything to make spinning easier
        const group = new THREE.Group();
        this.scene.add(group);
        this.group = group;

        // Particles and Lines logic
        this.particlesGeometry = new THREE.BufferGeometry();
        this.particlePositions = new Float32Array(this.particleCount * 3);

        const pMaterial = new THREE.PointsMaterial({
            color: 0x00ebff,
            size: 2.5,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        for (let i = 0; i < this.particleCount; i++) {
            const x = Math.random() * this.r - this.r / 2;
            const y = Math.random() * this.r - this.r / 2;
            const z = Math.random() * this.r - this.r / 2;

            this.particlePositions[i * 3] = x;
            this.particlePositions[i * 3 + 1] = y;
            this.particlePositions[i * 3 + 2] = z;

            this.particleData.push({
                velocity: new THREE.Vector3(
                    (-1 + Math.random() * 2) * 0.5,
                    (-1 + Math.random() * 2) * 0.5,
                    (-1 + Math.random() * 2) * 0.5
                ),
                numConnections: 0
            });
        }

        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.particlePositions, 3));
        this.particlesGeometry.setDrawRange(0, this.particleCount);

        this.particles = new THREE.Points(this.particlesGeometry, pMaterial);
        group.add(this.particles);

        // Lines setup
        // Max connections = (particleCount * (particleCount - 1)) / 2
        const segments = this.particleCount * this.particleCount;
        this.positions = new Float32Array(segments * 3);
        this.colors = new Float32Array(segments * 3);

        const material = new THREE.LineBasicMaterial({
            vertexColors: true,
            blending: THREE.AdditiveBlending,
            transparent: true,
            opacity: 0.3
        });

        this.linesGeometry = new THREE.BufferGeometry();
        this.linesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.linesGeometry.setAttribute('color', new THREE.BufferAttribute(this.colors, 3));
        
        this.linesMesh = new THREE.LineSegments(this.linesGeometry, material);
        group.add(this.linesMesh);

        // Add some ambient background lights for a subtle glow effect
        const ambientLight = new THREE.AmbientLight(0x0a0a0a);
        this.scene.add(ambientLight);

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.setupEventListeners();
        this.animate();
    }

    setupEventListeners() {
        this.handleMouseMove = (event) => {
            this.mouseX = event.clientX - this.windowHalfX;
            this.mouseY = event.clientY - this.windowHalfY;
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

        let vertexpos = 0;
        let colorpos = 0;
        let numConnected = 0;

        // Reset connection counter
        for (let i = 0; i < this.particleCount; i++)
            this.particleData[i].numConnections = 0;

        // Update positions & check boundaries
        for (let i = 0; i < this.particleCount; i++) {
            const particleData = this.particleData[i];

            this.particlePositions[i * 3] += particleData.velocity.x;
            this.particlePositions[i * 3 + 1] += particleData.velocity.y;
            this.particlePositions[i * 3 + 2] += particleData.velocity.z;

            // Bounce off boundaries seamlessly
            if (this.particlePositions[i * 3 + 1] < -this.r / 2 || this.particlePositions[i * 3 + 1] > this.r / 2)
                particleData.velocity.y = -particleData.velocity.y;
            if (this.particlePositions[i * 3] < -this.r / 2 || this.particlePositions[i * 3] > this.r / 2)
                particleData.velocity.x = -particleData.velocity.x;
            if (this.particlePositions[i * 3 + 2] < -this.r / 2 || this.particlePositions[i * 3 + 2] > this.r / 2)
                particleData.velocity.z = -particleData.velocity.z;

            // Check connections with other nodes
            for (let j = i + 1; j < this.particleCount; j++) {
                const particleDataB = this.particleData[j];

                const dx = this.particlePositions[i * 3] - this.particlePositions[j * 3];
                const dy = this.particlePositions[i * 3 + 1] - this.particlePositions[j * 3 + 1];
                const dz = this.particlePositions[i * 3 + 2] - this.particlePositions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // Only connect nodes within max distance
                if (dist < this.maxConnectionDistance) {
                    particleData.numConnections++;
                    particleDataB.numConnections++;

                    const alpha = 1.0 - dist / this.maxConnectionDistance;

                    this.positions[vertexpos++] = this.particlePositions[i * 3];
                    this.positions[vertexpos++] = this.particlePositions[i * 3 + 1];
                    this.positions[vertexpos++] = this.particlePositions[i * 3 + 2];

                    this.positions[vertexpos++] = this.particlePositions[j * 3];
                    this.positions[vertexpos++] = this.particlePositions[j * 3 + 1];
                    this.positions[vertexpos++] = this.particlePositions[j * 3 + 2];

                    // Interpolate colors based on proximity (cyan to deep blue)
                    this.colors[colorpos++] = alpha * 0.1;     // R
                    this.colors[colorpos++] = alpha * 0.7;     // G
                    this.colors[colorpos++] = alpha * 1.0;     // B

                    this.colors[colorpos++] = alpha * 0.1;
                    this.colors[colorpos++] = alpha * 0.7;
                    this.colors[colorpos++] = alpha * 1.0;

                    numConnected++;
                }
            }
        }

        // Inform renderer things mutated
        this.linesMesh.geometry.setDrawRange(0, numConnected * 2);
        this.linesMesh.geometry.attributes.position.needsUpdate = true;
        this.linesMesh.geometry.attributes.color.needsUpdate = true;
        this.particles.geometry.attributes.position.needsUpdate = true;

        // Interactive Camera movement based on mouse
        this.targetX = this.mouseX * 0.8;
        this.targetY = this.mouseY * 0.8;

        // Smoothly interpolate camera position toward target
        this.camera.position.x += (this.targetX - this.camera.position.x) * 0.05;
        this.camera.position.y += (-this.targetY - this.camera.position.y) * 0.05;
        this.camera.lookAt(this.scene.position);

        // Slow auto-rotation
        this.group.rotation.y += 0.0015;
        this.group.rotation.x += 0.0005;

        // Render scene
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
        
        // Comprehensive resource cleanup
        if (this.scene) {
            this.scene.traverse((object) => {
                if (!object.isMesh && !object.isLine && !object.isPoints) return;
                
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

export default function NeuralNetworkBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new NeuralNetworkClass(containerRef.current);

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
