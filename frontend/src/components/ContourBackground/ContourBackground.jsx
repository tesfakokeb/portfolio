import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import styles from './ContourBackground.module.css';

/**
 * Signature ambient background: nested contour lines evoking a topographic /
 * watershed elevation map, with a slow parallax drift tied to scroll.
 * tone: 'light' draws lighter strokes for use on dark hero sections, etc.
 */
export default function ContourBackground({ variant = 'default', parallax = true }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, parallax ? -60 : 0]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, parallax ? -30 : 0]);

  const paths = [
    'M-100,180 C120,60 280,260 480,140 C680,20 820,220 1020,120 C1180,50 1300,150 1500,90',
    'M-100,260 C100,160 300,340 500,220 C700,100 860,300 1060,200 C1220,130 1340,230 1520,170',
    'M-100,340 C90,260 320,420 520,300 C720,180 880,380 1080,280 C1240,210 1360,310 1540,250',
  ];

  return (
    <div className={`${styles.wrap} ${styles[variant] || ''}`} ref={ref} aria-hidden="true">
      <motion.svg className={styles.layer} style={{ y: y1 }} viewBox="0 0 1400 500" preserveAspectRatio="none">
        <path d={paths[0]} />
        <path d={paths[1]} />
      </motion.svg>
      <motion.svg className={styles.layer} style={{ y: y2 }} viewBox="0 0 1400 500" preserveAspectRatio="none">
        <path d={paths[2]} />
      </motion.svg>
    </div>
  );
}
