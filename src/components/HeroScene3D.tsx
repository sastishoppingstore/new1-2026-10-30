import { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Props {
  variant?: 'house' | 'tower';
}

export default function HeroScene3D({ variant = 'house' }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(8, 6, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff2c0, 1.4);
    key.position.set(6, 10, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x66ff99, 0.5);
    fill.position.set(-6, 4, -3);
    scene.add(fill);
    const rim = new THREE.PointLight(0xffd700, 1.2, 30);
    rim.position.set(0, 5, -5);
    scene.add(rim);

    // Ground plate
    const groundGeo = new THREE.CylinderGeometry(6.5, 6.5, 0.18, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x01411c,
      metalness: 0.4,
      roughness: 0.4,
      emissive: 0x01411c,
      emissiveIntensity: 0.15,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -0.4;
    scene.add(ground);

    // Gold ring
    const ringGeo = new THREE.TorusGeometry(6.3, 0.08, 16, 200);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 1,
      roughness: 0.18,
      emissive: 0xd4af37,
      emissiveIntensity: 0.4,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.3;
    scene.add(ring);

    // House / Tower group
    const group = new THREE.Group();

    if (variant === 'house') {
      // Base
      const baseGeo = new THREE.BoxGeometry(4, 2.6, 4);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0xfbfaef,
        metalness: 0.15,
        roughness: 0.5,
      });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 1.0;
      group.add(base);

      // Mid section
      const midGeo = new THREE.BoxGeometry(3, 1.6, 3);
      const midMat = new THREE.MeshStandardMaterial({
        color: 0x046a38,
        metalness: 0.2,
        roughness: 0.4,
      });
      const mid = new THREE.Mesh(midGeo, midMat);
      mid.position.y = 3.1;
      group.add(mid);

      // Windows
      const winMat = new THREE.MeshStandardMaterial({
        color: 0xffe88a,
        emissive: 0xffd700,
        emissiveIntensity: 0.6,
        metalness: 0.7,
        roughness: 0.2,
      });
      for (let i = 0; i < 4; i++) {
        const w = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.05), winMat);
        const side = i < 2 ? 1 : -1;
        const front = i % 2 === 0 ? 1 : -1;
        w.position.set(side * 1.2, 1.0, front * 2.01);
        group.add(w);
      }

      // Roof
      const roofGeo = new THREE.ConeGeometry(2.6, 1.4, 4);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0x01411c,
        metalness: 0.5,
        roughness: 0.3,
        flatShading: true,
      });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 4.4;
      roof.rotation.y = Math.PI / 4;
      group.add(roof);

      // Top finial
      const finial = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.1 })
      );
      finial.position.y = 5.4;
      group.add(finial);

      // Door
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(0.7, 1.2, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x8c6e1a, metalness: 0.4, roughness: 0.4 })
      );
      door.position.set(0, 0.5, 2.01);
      group.add(door);

      // Pool
      const pool = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 0.05, 1.2),
        new THREE.MeshStandardMaterial({
          color: 0x4ec3ff,
          metalness: 0.9,
          roughness: 0.05,
          emissive: 0x1188cc,
          emissiveIntensity: 0.5,
        })
      );
      pool.position.set(0, -0.28, 3.2);
      group.add(pool);

      // Trees
      for (let i = 0; i < 4; i++) {
        const trunk = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8),
          new THREE.MeshStandardMaterial({ color: 0x5a3a1a })
        );
        const top = new THREE.Mesh(
          new THREE.SphereGeometry(0.5, 12, 12),
          new THREE.MeshStandardMaterial({ color: 0x0a6e2a })
        );
        const ang = (i / 4) * Math.PI * 2;
        trunk.position.set(Math.cos(ang) * 4.2, 0.05, Math.sin(ang) * 4.2);
        top.position.set(Math.cos(ang) * 4.2, 0.8, Math.sin(ang) * 4.2);
        group.add(trunk);
        group.add(top);
      }
    } else {
      // Tower variant: 3 stacked luxury blocks
      const colors = [0xfbfaef, 0x046a38, 0x01411c];
      const heights = [1.6, 1.4, 1.2];
      let y = 0.4;
      for (let i = 0; i < 3; i++) {
        const block = new THREE.Mesh(
          new THREE.BoxGeometry(2.4, heights[i], 2.4),
          new THREE.MeshStandardMaterial({ color: colors[i], metalness: 0.3, roughness: 0.4 })
        );
        block.position.y = y + heights[i] / 2;
        group.add(block);

        // Gold trim
        const trim = new THREE.Mesh(
          new THREE.BoxGeometry(2.5, 0.06, 2.5),
          new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 1, roughness: 0.2 })
        );
        trim.position.y = y;
        group.add(trim);

        y += heights[i];
      }
    }

    scene.add(group);

    // Floating particles
    const particleCount = 60;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xd4af37,
      size: 0.08,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(particles, pMat);
    scene.add(points);

    // Pointer
    let mouseX = 0, mouseY = 0;
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener('pointermove', onPointer);

    let raf = 0;
    const start = performance.now();
    const animate = (t: number) => {
      const elapsed = (t - start) / 1000;
      group.rotation.y = elapsed * 0.25 + mouseX * 0.3;
      group.rotation.x = Math.sin(elapsed * 0.3) * 0.05 - mouseY * 0.1;
      group.position.y = Math.sin(elapsed * 0.8) * 0.15;
      ring.rotation.z = elapsed * 0.4;
      points.rotation.y = elapsed * 0.1;

      // Twinkle particles
      pMat.opacity = 0.6 + Math.sin(elapsed * 2) * 0.3;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      mount.removeEventListener('pointermove', onPointer);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) {
          const mat = m.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
          else mat.dispose();
        }
      });
    };
  }, [variant]);

  return <div ref={mountRef} className="absolute inset-0" />;
}
