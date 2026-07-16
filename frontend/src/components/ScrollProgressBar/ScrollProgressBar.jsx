import { motion, useScroll, useSpring } from 'framer-motion';
import styles from './ScrollProgressBar.module.css';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });

  return <motion.div className={styles.bar} style={{ scaleX }} aria-hidden="true" />;
}
