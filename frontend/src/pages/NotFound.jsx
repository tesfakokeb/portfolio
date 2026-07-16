import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import Button from '../components/ui/Button.jsx';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <motion.main
      className={styles.wrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className={styles.content}>
        <span className={styles.code}>404</span>
        <h1>Off the map</h1>
        <p>This coordinate doesn't resolve to a page. Let's get you back to known terrain.</p>
        <Button href="/" variant="primary" icon={FaHome}>
          Back to home
        </Button>
      </div>
    </motion.main>
  );
}
