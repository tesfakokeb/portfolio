import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import styles from './CustomCursor.module.css';

/**
 * A soft trailing dot cursor for pointer devices.
 * Hidden automatically on touch devices and when reduced motion is preferred.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hoveringLink, setHoveringLink] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const springX = useSpring(x, { stiffness: 400, damping: 32 });
  const springY = useSpring(y, { stiffness: 400, damping: 32 });

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setEnabled(isFinePointer && !prefersReducedMotion);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const move = (e) => {
      x.set(e.clientX - 10);
      y.set(e.clientY - 10);
      const target = e.target;
      setHoveringLink(!!target.closest('a, button, [role="button"], input, textarea'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className={`${styles.cursor} ${hoveringLink ? styles.active : ''}`}
      style={{ translateX: springX, translateY: springY }}
      aria-hidden="true"
    />
  );
}
