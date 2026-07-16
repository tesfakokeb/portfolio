import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../../hooks/useCountUp.js';
import styles from './StatCounter.module.css';

export default function StatCounter({ value, suffix = '', label }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const count = useCountUp(value, { start: inView });

  return (
    <motion.div
      ref={ref}
      className={styles.stat}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <span className={styles.value}>
        {count}
        {suffix}
      </span>
      <span className={styles.label}>{label}</span>
    </motion.div>
  );
}
