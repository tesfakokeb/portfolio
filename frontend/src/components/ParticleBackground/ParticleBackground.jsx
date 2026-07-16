import { useEffect, useRef } from 'react';
import styles from './ParticleBackground.module.css';

/**
 * Lightweight canvas particle field — small drifting nodes connected by
 * faint lines when close, evoking a satellite telemetry / sensor network.
 */
export default function ParticleBackground({ density = 60 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles, rafId;

    const resize = () => {
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    const init = () => {
      resize();
      const count = Math.round((width * height) / (18000 * window.devicePixelRatio));
      particles = Array.from({ length: Math.min(count, density) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 0.6,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(79, 211, 196, 0.55)';
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 130 * window.devicePixelRatio) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(46, 125, 209, ${0.14 * (1 - dist / (130 * window.devicePixelRatio))})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };

    init();
    if (!prefersReducedMotion) {
      rafId = requestAnimationFrame(draw);
    } else {
      draw();
    }

    const handleResize = () => init();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(rafId);
    };
  }, [density]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
