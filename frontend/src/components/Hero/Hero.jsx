import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaArrowRight,FaDownload,FaFacebook,FaTwitter } from 'react-icons/fa';
import { profile } from '../../data/profile.js';
import { useTypingEffect } from '../../hooks/useTypingEffect.js';
import ParticleBackground from '../ParticleBackground/ParticleBackground.jsx';
import Button from '../ui/Button.jsx';
import styles from './Hero.module.css';

const socialIcons = [
  { key: 'github', icon: FaGithub, href: profile.social.github, label: 'GitHub' },
  { key: 'linkedin', icon: FaLinkedin, href: profile.social.linkedin, label: 'LinkedIn' },
  { key: 'scholar', icon: FaGraduationCap, href: profile.social.scholar, label: 'Google Scholar' },
  { key: 'email', icon: FaEnvelope, href: profile.social.email, label: 'Email' },
  // { key: 'cv', icon: FaDownload, href: profile.cvUrl, label: 'Download CV' },
  { key: 'facebook', icon: FaFacebook, href: profile.social.facebook, label: 'Facebook' },
  { key: 'twitter', icon: FaTwitter, href: profile.social.twitter, label: 'Twitter' },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export default function Hero() {
  const typed = useTypingEffect(profile.taglineWords);

  const scrollTo = (e, href) => {
    e.preventDefault();
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className={styles.hero}>
      <ParticleBackground />
      <div className={styles.glow} aria-hidden="true" />

      <motion.div className={`${styles.inner} container`} variants={container} initial="hidden" animate="show">
        <motion.div className={styles.text}>
          <motion.span variants={item} className={styles.eyebrow}>
            <span className={styles.dot} />
            AVAILABLE FOR RESEARCH COLLABORATION|AI APPLICATION DEVELOPMENT|DATA SCIENCE CONSULTING
          </motion.span>

          <motion.h1 variants={item} className={styles.name}>
            {profile.name}
            <span className={styles.credentials}>, {profile.credentials}</span>
          </motion.h1>

          <motion.p variants={item} className={styles.position}>
            {profile.role} &middot; <span className={styles.org}>{profile.org}</span>
          </motion.p>

          <motion.div variants={item} className={styles.typing} aria-live="polite">
            <span className={styles.typingLabel}>Focus:</span>
            <span className={styles.typedText}>{typed}</span>
            <span className={styles.cursor} aria-hidden="true" />
          </motion.div>

          <motion.p variants={item} className={styles.summary}>
            {profile.summary}
          </motion.p>

          <motion.div variants={item} className={styles.ctas}>
            <Button href={profile.cvUrl} variant="primary" icon={FaDownload} download>
              Download Resume
            </Button>
            <Button href="#projects" variant="secondary" icon={FaArrowRight} onClick={(e) => scrollTo(e, '#projects')}>
              View Projects
            </Button>
            <Button href="#research" variant="ghost" onClick={(e) => scrollTo(e, '#research')}>
              Research
            </Button>
            <Button href="#contact" variant="ghost" onClick={(e) => scrollTo(e, '#contact')}>
              Contact
            </Button>
          </motion.div>

          <motion.div variants={item} className={styles.socials}>
            {socialIcons.filter((s) => s.href).map(({ key, icon: Icon, href, label }) => (
              <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialIcon}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.portrait}
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <div className={styles.portraitFrame}>
            {profile.profilePicUrl ? (
              <img src={profile.profilePicUrl} alt={profile.name} className={styles.portraitImage} />
            ) : (
              <div className={styles.portraitPlaceholder}>
                <span>{profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</span>
              </div>
            )}
            <motion.div
              className={styles.badge}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <span className={styles.badgeDot} />
              NASA Goddard
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#about"
        className={styles.scrollIndicator}
        onClick={(e) => scrollTo(e, '#about')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        aria-label="Scroll to About section"
      >
        <span className={styles.scrollLine}>
          <motion.span
            className={styles.scrollDotInner}
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
        <span className={styles.scrollLabel}>Scroll</span>
      </motion.a>
    </section>
  );
}
