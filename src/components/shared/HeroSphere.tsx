import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
/**
 * WebGL hero object: a fragmented chrome/matte-white faceted sphere
 * (asteroid/brain-like) that keeps rotating, tilts toward the mouse
 * cursor, and reacts to page scroll. Falls back gracefully if WebGL
 * is unavailable.
 */
export function HeroSphere({ className = '' }: {className?: string;}) {
  const mountRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;
    const size = () => Math.min(mount.clientWidth, mount.clientHeight) || 400;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    // fragmented sphere — icosahedron w/ displaced faces (flat shaded = faceted)
    const group = new THREE.Group();
    scene.add(group);
    const geo = new THREE.IcosahedronGeometry(1.35, 3);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const noise =
      Math.sin(n.x * 6) * 0.06 +
      Math.cos(n.y * 5) * 0.06 +
      Math.sin(n.z * 7) * 0.05;
      v.addScaledVector(n, noise);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    // flat facets
    const faceted = geo.toNonIndexed();
    const chrome = new THREE.MeshStandardMaterial({
      color: 0xdfe7ef,
      metalness: 0.95,
      roughness: 0.28,
      flatShading: true
    });
    const mesh = new THREE.Mesh(faceted, chrome);
    group.add(mesh);
    // subtle wireframe overlay for the "fragmented" read
    const wire = new THREE.Mesh(
      faceted.clone(),
      new THREE.MeshBasicMaterial({
        color: 0x3b82f6,
        wireframe: true,
        transparent: true,
        opacity: 0.12
      })
    );
    wire.scale.setScalar(1.01);
    group.add(wire);
    // lights — icy blue + cyan
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 5);
    scene.add(key);
    const cyanFill = new THREE.DirectionalLight(0x22d3ee, 1.6);
    cyanFill.position.set(-4, -1, 2);
    scene.add(cyanFill);
    const blueRim = new THREE.DirectionalLight(0x3b82f6, 1.8);
    blueRim.position.set(-2, 3, -4);
    scene.add(blueRim);
    scene.add(new THREE.AmbientLight(0xbfcbd9, 0.6));
    const mouse = {
      x: 0,
      y: 0
    };
    const onMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width * 2 - 1;
      mouse.y = (e.clientY - r.top) / r.height * 2 - 1;
    };
    window.addEventListener('mousemove', onMove);
    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);
    resize();
    let rafId = 0;
    const animate = () => {
      group.rotation.y += 0.0032 + scrollY * 0.000004;
      group.rotation.x += 0.0011;
      // tilt toward cursor
      const targetX = mouse.y * 0.35;
      const targetY = mouse.x * 0.5;
      group.rotation.x += (targetX - group.rotation.x % (Math.PI * 2)) * 0.02;
      camera.position.x += (mouse.x * 0.3 - camera.position.x) * 0.04;
      camera.position.y += (-mouse.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      geo.dispose();
      faceted.dispose();
      chrome.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);
  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`} />);


}