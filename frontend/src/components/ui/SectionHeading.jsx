import { motion } from 'framer-motion';
import styles from './SectionHeading.module.css';

/**
 * Shared section heading with a monospace "telemetry" eyebrow —
 * the site's signature typographic device, styled after satellite
 * data readouts (e.g. "SIG · HYDROLOGY").
 */
export default function SectionHeading({ eyebrow, title, description, align = 'left' }) {
  return (
    <motion.div
      className={`${styles.wrap} ${align === 'center' ? styles.center : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {eyebrow && (
        <span className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          {eyebrow}
        </span>
      )}
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </motion.div>
  );
}
