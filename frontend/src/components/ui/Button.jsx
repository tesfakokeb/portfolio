import { motion } from 'framer-motion';
import styles from './Button.module.css';

/**
 * Reusable button. Renders as <a> when `href` is passed, otherwise <button>.
 * variant: 'primary' | 'secondary' | 'ghost'
 */
export default function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  icon: Icon,
  iconPosition = 'right',
  type = 'button',
  className = '',
  ...rest
}) {
  const classes = `${styles.btn} ${styles[variant]} ${className}`;
  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon aria-hidden="true" className={styles.icon} />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon aria-hidden="true" className={styles.icon} />}
    </>
  );

  const motionProps = {
    whileHover: { y: -2 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.18 },
  };

  if (href) {
    return (
      <motion.a href={href} className={classes} {...motionProps} {...rest}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={classes} {...motionProps} {...rest}>
      {content}
    </motion.button>
  );
}
