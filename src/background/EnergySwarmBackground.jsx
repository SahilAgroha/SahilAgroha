import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class EnergySwarmClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        this.particles = null;
        this.positions = null;
        
        this.particleCount = 7000;
        this.particlesData = [];
        
        // Mouse and Raycasting for accurate 3D tracking
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseVec = new THREE.Vector2(0, 0);
        this.targetPos = new THREE.Vector3(0, 0, 0);
        this.roamPos = new THREE.Vector3(0, 0, 0);
        
        this.isMouseMoving = false;
        this.mouseTimeout = null;
        
        this.clock = new THREE.Clock();
        this.animationId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        // Deep contrast black/purple space
        this.scene.background = new THREE.Color(0x020205);
        this.scene.fog = new THREE.FogExp2(0x020205, 0.0008);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 3000);
        this.camera.position.set(0, 0, 800);

        // --- THE ENERGY CONTINUUM (Particle Swarm) ---
        const geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.particleCount * 3);
        const colors = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);

        for (let i = 0; i < this.particleCount; i++) {
            const i3 = i * 3;
            // Spawn scattered around
            this.positions[i3] = (Math.random() - 0.5) * 2000;
            this.positions[i3 + 1] = (Math.random() - 0.5) * 2000;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 2000;

            // Blend colors between vibrant cyan, neon blue, and electric purple
            const color = new THREE.Color();
            color.setHSL(0.55 + Math.random() * 0.3, 0.9, 0.6);
            
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
            
            // Random sizes for depth
            sizes[i] = Math.random() * 2;

            // Provide physics profiles for chaos
            this.particlesData.push({
                velocity: new THREE.Vector3((Math.random()-0.5)*5, (Math.random()-0.5)*5, (Math.random()-0.5)*5),
                maxSpeed: 8 + Math.random() * 12,
                pullStrength: 0.01 + Math.random() * 0.05,
                // The swirl multiplier dictates if they orbit clockwise or counter-clockwise
                swirlFactor: (Math.random() > 0.5 ? 1 : -1) * (1 + Math.random() * 2)
            });
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        // Note: standard PointsMaterial doesn't use generic sizes attribute natively without shaders, 
        // so we just rely on global size, but keep sizes array if we want to upgrade to ShaderMaterial later.

        const material = new THREE.PointsMaterial({
            size: 2.5,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending,
            depthWrite: false, // Prevents dark halos
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);

        // A massive, very faint background glow to make it look highly cohesive
        const glowMat = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            transparent: true,
            opacity: 0.06,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        this.centerGlow = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 32), glowMat);
        this.scene.add(this.centerGlow);

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
            this.isMouseMoving = true;
            this.mouseVec.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseVec.y = -(event.clientY / window.innerHeight) * 2 + 1;
            
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.isMouseMoving = false;
            }, 3000); // 3 seconds of no mouse movement = switch to roam mode
        };

        this.handleResize = () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        };

        document.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('resize', this.handleResize);
    }

    // Projects 2D mouse coordinates onto a 3D plane in front of the camera
    updateTargetPosition() {
        const vec = new THREE.Vector3(this.mouseVec.x, this.mouseVec.y, 0.5);
        vec.unproject(this.camera);
        const dir = vec.sub(this.camera.position).normalize();
        // project the coordinates onto a plane 600 units away
        const distance = -this.camera.position.z / dir.z; 
        
        // Offset Z to bring the swarm exactly to z=0 or slightly in front
        // Distance calculation yields the intersection with Z=0 plane roughly
        this.targetPos = this.camera.position.clone().add(dir.multiplyScalar(distance));
    }

    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = this.clock.getElapsedTime();

        // 1. DETERMINE THE GRAVITY CENTER 
        if (this.isMouseMoving) {
            this.updateTargetPosition();
        } else {
            // When idle, the swarm beautifully roams the screen in a massive infinity 8 shape
            this.roamPos.x = Math.sin(time * 0.5) * 500;
            this.roamPos.y = Math.cos(time * 0.3) * 300 + Math.sin(time * 0.8) * 100;
            this.roamPos.z = Math.sin(time * 0.7) * 200;
            
            // Smoothly move the target point towards the roam position
            this.targetPos.lerp(this.roamPos, 0.02);
        }

        // Move the subtle background glow toward the swarm center
        this.centerGlow.position.lerp(this.targetPos, 0.05);
        
        // Slowly pulse camera slightly for dynamic feel
        this.camera.position.z = 800 + Math.sin(time * 0.5) * 50;

        // 2. SIMULATE FLUID SWARM PHYSICS FOR ALL 7000 POINTS
        for (let i = 0; i < this.particleCount; i++) {
            const pData = this.particlesData[i];
            const i3 = i * 3;

            const px = this.positions[i3];
            const py = this.positions[i3 + 1];
            const pz = this.positions[i3 + 2];
            const pVec = new THREE.Vector3(px, py, pz);

            // Vector pointing from particle to the target
            const dir = new THREE.Vector3().subVectors(this.targetPos, pVec);
            const dist = dir.length();
            
            dir.normalize();

            // Swirl / Chaos Physics
            // Cross product creates a vector perpendicular to the direction toward target,
            // effectively making the particle orbit the target rather than just flying straight in.
            // By multiplying with swirlFactor, some orbit clockwise, some counter-clockwise.
            const swirl = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(0, 1, 0)).multiplyScalar(pData.swirlFactor);
            // Mix in a secondary axis swirl for fully 3D chaos
            const swirl2 = new THREE.Vector3().crossVectors(dir, new THREE.Vector3(1, 0, 0)).multiplyScalar(pData.swirlFactor * 0.5);

            // Calculate the total force
            // As they get extremely close (dist < 50), we weaken the direct pull to prevent a harsh clump
            const pullMultiplier = dist < 50 ? dist / 50 : 1;
            const force = dir.multiplyScalar(pData.pullStrength * pullMultiplier)
                            .add(swirl.multiplyScalar(0.04))
                            .add(swirl2.multiplyScalar(0.02));

            // Apply force to velocity
            pData.velocity.add(force);

            // Enforce terminal velocity (speed limit)
            if (pData.velocity.length() > pData.maxSpeed) {
                pData.velocity.normalize().multiplyScalar(pData.maxSpeed);
            }

            // Apply friction (crucial for them not exploding infinitely)
            pData.velocity.multiplyScalar(0.96);

            // Update physical positions in the Float32Array
            this.positions[i3] += pData.velocity.x;
            this.positions[i3 + 1] += pData.velocity.y;
            this.positions[i3 + 2] += pData.velocity.z;
        }

        // Notify WebGL that points moved
        this.particles.geometry.attributes.position.needsUpdate = true;

        // Render Frame
        this.renderer.render(this.scene, this.camera);
    }

    destroy() {
        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
        }
        clearTimeout(this.mouseTimeout);
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);

        if (this.container && this.renderer && this.renderer.domElement) {
            this.container.removeChild(this.renderer.domElement);
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Exhaustive cleanup
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

export default function EnergySwarmBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new EnergySwarmClass(containerRef.current);

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
