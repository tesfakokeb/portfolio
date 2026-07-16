import { motion } from 'framer-motion';
import styles from './GlassCard.module.css';

export default function GlassCard({ children, className = '', hover = true, as: Tag = motion.div, ...rest }) {
  return (
    <Tag
      className={`${styles.card} ${hover ? styles.hover : ''} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
