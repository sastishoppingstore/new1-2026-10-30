import { useRef, useEffect, useState } from 'react';

export function useTilt(max = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const px = x / rect.width;
      const py = y / rect.height;
      const rx = (py - 0.5) * -max;
      const ry = (px - 0.5) * max;
      setTransform(
        `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04) translateZ(20px)`
      );
      setGlare({ x: px * 100, y: py * 100, opacity: 1 });
    };
    const onLeave = () => {
      setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)');
      setGlare((g) => ({ ...g, opacity: 0 }));
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [max]);

  return { ref, transform, glare };
}
