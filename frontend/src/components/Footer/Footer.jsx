import { FaGithub, FaLinkedin, FaGraduationCap, FaEnvelope, FaArrowUp, FaFacebook, FaTwitter } from 'react-icons/fa';
import { profile } from '../../data/profile.js';
import { navLinks } from '../../data/nav.js';
import { researchCategories } from '../../data/research.js';
import styles from './Footer.module.css';

export default function Footer() {
  const year = new Date().getFullYear();

  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.bg} aria-hidden="true" />
      <div className={`container ${styles.inner}`}>
        <div className={styles.grid}>
          <div className={styles.brand}>
            <a href="#home" className={styles.logo} onClick={scrollToTop}>
              <span className={styles.logoMark}>TW</span>
              <span>Tesfa Worku Meshesha</span>
            </a>
            <p className={styles.tagline}>{profile.role} — {profile.org}</p>
            <div className={styles.socials}>
              <a href={profile.social.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FaGithub aria-hidden="true" /></a>
              <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedin aria-hidden="true" /></a>
              <a href={profile.social.scholar} target="_blank" rel="noopener noreferrer" aria-label="Google Scholar"><FaGraduationCap aria-hidden="true" /></a>
              <a href={profile.social.email} aria-label="Email"><FaEnvelope aria-hidden="true" /></a>
              {profile.social.facebook && (
                <a href={profile.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebook aria-hidden="true" /></a>
              )}
              {profile.social.twitter && (
                <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FaTwitter aria-hidden="true" /></a>
              )}
            </div>
          </div>

          <div className={styles.col}>
            <h4>Quick Links</h4>
            <ul>
              {navLinks.slice(0, 6).map((l) => (
                <li key={l.href}><a href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Research Areas</h4>
            <ul>
              {researchCategories.filter((c) => c !== 'All').map((c) => (
                <li key={c}><a href="#research">{c}</a></li>
              ))}
            </ul>
          </div>

          <div className={styles.col}>
            <h4>Social</h4>
            <ul>
              <li><a href={profile.social.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href={profile.social.scholar} target="_blank" rel="noopener noreferrer">Google Scholar</a></li>
              <li><a href={profile.social.email}>Email</a></li>
              {profile.social.facebook && (
                <li><a href={profile.social.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
              )}
              {profile.social.twitter && (
                <li><a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">Twitter</a></li>
              )}
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>&copy; {year} {profile.name}. All rights reserved.</p>
          <button onClick={scrollToTop} className={styles.toTop} aria-label="Back to top">
            <FaArrowUp aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
