import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

class MatrixBackgroundClass {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cubes = [];
        this.pyramids = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        this.animationId = null;

        this.init();
    }

    init() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0d0d0d);
        this.scene.fog = new THREE.Fog(0x0d0d0d, 50, 150);

        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            200
        );
        this.camera.position.set(0, 20, 50);
        this.camera.lookAt(0, 0, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.createGeometricGrid();
        this.createFloatingShapes();
        this.createParticleField();
        this.setupLighting();
        this.setupEventListeners();
        this.animate();
    }

    createGeometricGrid() {
        const gridSize = 15;
        const spacing = 8;
        const offset = (gridSize * spacing) / 2;

        for (let x = 0; x < gridSize; x++) {
            for (let z = 0; z < gridSize; z++) {
                // Alternate between different shapes
                const shapeType = (x + z) % 3;
                let geometry;

                switch (shapeType) {
                    case 0:
                        geometry = new THREE.BoxGeometry(2, 2, 2);
                        break;
                    case 1:
                        geometry = new THREE.ConeGeometry(1, 2, 4);
                        break;
                    case 2:
                        geometry = new THREE.OctahedronGeometry(1.2);
                        break;
                }

                // Gradient colors based on position
                const hue = ((x + z) / (gridSize * 2)) * 0.3 + 0.5; // Cyan to purple
                const color = new THREE.Color().setHSL(hue, 0.7, 0.5);

                const material = new THREE.MeshStandardMaterial({
                    color: color,
                    metalness: 0.7,
                    roughness: 0.3,
                    emissive: color,
                    emissiveIntensity: 0.2,
                    wireframe: Math.random() > 0.7
                });

                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(
                    x * spacing - offset,
                    0,
                    z * spacing - offset
                );

                mesh.userData.originalY = 0;
                mesh.userData.phase = Math.random() * Math.PI * 2;
                mesh.userData.speed = 0.5 + Math.random() * 0.5;
                mesh.userData.rotationSpeed = new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.02
                );

                this.scene.add(mesh);
                this.cubes.push(mesh);
            }
        }
    }

    createFloatingShapes() {
        // Large floating geometric shapes
        const shapes = [
            { geo: new THREE.IcosahedronGeometry(3, 0), color: 0xff00ff },
            { geo: new THREE.TorusGeometry(3, 1, 16, 100), color: 0x00ffff },
            { geo: new THREE.TetrahedronGeometry(3), color: 0xffff00 },
            { geo: new THREE.OctahedronGeometry(3), color: 0xff0080 }
        ];

        shapes.forEach((shape, index) => {
            const material = new THREE.MeshStandardMaterial({
                color: shape.color,
                wireframe: true,
                transparent: true,
                opacity: 0.3,
                emissive: shape.color,
                emissiveIntensity: 0.5
            });

            const mesh = new THREE.Mesh(shape.geo, material);
            mesh.position.set(
                (Math.random() - 0.5) * 80,
                20 + Math.random() * 20,
                (Math.random() - 0.5) * 80
            );

            mesh.userData.rotationSpeed = new THREE.Vector3(
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01,
                (Math.random() - 0.5) * 0.01
            );

            this.scene.add(mesh);
            this.pyramids.push(mesh);
        });
    }

    createParticleField() {
        // Background particle field
        const particleCount = 2000;
        const geometry = new THREE.BufferGeometry();
        const positions = [];
        const colors = [];

        for (let i = 0; i < particleCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 200,
                Math.random() * 100 - 20,
                (Math.random() - 0.5) * 200
            );

            // Colorful particles
            const hue = Math.random() * 0.4 + 0.5;
            const color = new THREE.Color().setHSL(hue, 0.8, 0.6);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Main directional light
        const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
        mainLight.position.set(10, 30, 10);
        this.scene.add(mainLight);

        // Colored point lights
        const colors = [0xff00ff, 0x00ffff, 0xffff00];
        colors.forEach((color, index) => {
            const light = new THREE.PointLight(color, 1, 100);
            light.position.set(
                Math.cos((index / colors.length) * Math.PI * 2) * 40,
                10,
                Math.sin((index / colors.length) * Math.PI * 2) * 40
            );
            this.scene.add(light);
            this.pyramids.push(light); // Reuse for animation
        });
    }

    setupEventListeners() {
        this.handleMouseMove = (event) => {
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
        this.time += 0.01;

        // Animate grid cubes
        this.cubes.forEach((cube, index) => {
            // Wave motion
            const wave = Math.sin(this.time * cube.userData.speed + cube.userData.phase);
            cube.position.y = cube.userData.originalY + wave * 5;

            // Rotation
            cube.rotation.x += cube.userData.rotationSpeed.x;
            cube.rotation.y += cube.userData.rotationSpeed.y;
            cube.rotation.z += cube.userData.rotationSpeed.z;

            // Pulse emissive intensity
            const pulse = Math.sin(this.time * 2 + cube.userData.phase) * 0.5 + 0.5;
            cube.material.emissiveIntensity = 0.1 + pulse * 0.3;

            // Scale pulse
            const scale = 1 + Math.sin(this.time + cube.userData.phase) * 0.1;
            cube.scale.setScalar(scale);
        });

        // Animate floating shapes
        this.pyramids.forEach((shape, index) => {
            if (shape.geometry) {
                shape.rotation.x += shape.userData.rotationSpeed.x;
                shape.rotation.y += shape.userData.rotationSpeed.y;
                shape.rotation.z += shape.userData.rotationSpeed.z;

                // Float up and down
                shape.position.y += Math.sin(this.time + index) * 0.02;

                // Pulse opacity
                const pulse = Math.sin(this.time * 2 + index) * 0.5 + 0.5;
                if (shape.material.opacity !== undefined) {
                    shape.material.opacity = 0.2 + pulse * 0.2;
                }
            } else if (shape.isPointLight) {
                // Rotate lights
                const angle = this.time * 0.5 + (index / 3) * Math.PI * 2;
                shape.position.x = Math.cos(angle) * 40;
                shape.position.z = Math.sin(angle) * 40;
                shape.position.y = 10 + Math.sin(this.time + index) * 5;
            }
        });

        // Animate particles
        this.particles.rotation.y += 0.0002;
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(this.time + i) * 0.01;
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        // Camera movement based on mouse
        this.camera.position.x += (this.mouseX * 20 - this.camera.position.x) * 0.05;
        this.camera.position.y += (this.mouseY * 10 + 20 - this.camera.position.y) * 0.05;
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
                if (!object.isMesh) return;
                
                object.geometry.dispose();
                
                if (object.material.isMaterial) {
                    cleanMaterial(object.material);
                } else {
                    for (const material of object.material) {
                        cleanMaterial(material);
                    }
                }
            });
        }
    }
}

function cleanMaterial(material) {
    material.dispose();
    for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && 'minFilter' in value) {
            value.dispose();
        }
    }
}

export default function MatrixBackground() {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const bg = new MatrixBackgroundClass(containerRef.current);

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
