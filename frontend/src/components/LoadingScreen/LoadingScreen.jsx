import { motion } from 'framer-motion';
import styles from './LoadingScreen.module.css';

export default function LoadingScreen() {
  return (
    <motion.div
      className={styles.screen}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
      aria-hidden="true"
    >
      <div className={styles.center}>
        <svg className={styles.ring} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="42" className={styles.track} />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            className={styles.sweep}
            initial={{ pathLength: 0, rotate: -90 }}
            animate={{ pathLength: [0, 1, 0], rotate: [-90, 270, 630] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          />
        </svg>
        <motion.span
          className={styles.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          TWM
        </motion.span>
      </div>
    </motion.div>
  );
}
