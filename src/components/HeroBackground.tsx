import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const HeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const container = containerRef.current;
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    camera.position.z = 80;

    // Stars
    const N = 2000;
    const pos = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 50 + Math.random() * 100;
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th);
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      pos[i * 3 + 2] = r * Math.cos(ph);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const stars = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xC9A84C, size: 0.55, transparent: true, opacity: 0.5 }));
    scene.add(stars);

    // Rings
    const addRing = (r: number, tube: number, ox: number, oz: number, op: number) => {
      const m = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 10, 120),
        new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: op })
      );
      m.rotation.x = ox;
      m.rotation.z = oz;
      return m;
    };
    const r1 = addRing(36, 0.28, Math.PI / 2.5, 0, 0.16);
    const r2 = addRing(54, 0.18, Math.PI / 3, 0.4, 0.09);
    const r3 = addRing(68, 0.12, 1.1, -0.3, 0.06);
    scene.add(r1, r2, r3);

    // Icosahedron wireframe
    const ico = new THREE.Mesh(
      new THREE.IcosahedronGeometry(15, 1),
      new THREE.MeshBasicMaterial({ color: 0xC9A84C, wireframe: true, transparent: true, opacity: 0.055 })
    );
    scene.add(ico);

    // Center pulse sphere
    const pulse = new THREE.Mesh(
      new THREE.SphereGeometry(5, 24, 24),
      new THREE.MeshBasicMaterial({ color: 0xC9A84C, transparent: true, opacity: 0.07 })
    );
    scene.add(pulse);

    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    let t = 0;
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      t += 0.005;
      scene.rotation.y = t * 0.15 + mx * 0.08;
      scene.rotation.x = my * 0.05;
      r1.rotation.z = t * 0.18;
      r2.rotation.y = t * 0.11;
      r3.rotation.x = Math.PI / 3 + t * 0.08;
      ico.rotation.y = t * 0.28;
      ico.rotation.x = t * 0.18;
      pulse.scale.setScalar(1 + Math.sin(t * 2) * 0.06);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.offsetWidth / containerRef.current.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.offsetWidth, containerRef.current.offsetHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};
