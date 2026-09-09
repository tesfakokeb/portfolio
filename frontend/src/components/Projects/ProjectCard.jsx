import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt, FaGraduationCap } from 'react-icons/fa';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import styles from './ProjectCard.module.css';

/**
 * Pick the first usable URL from a project, tolerating the key-name variants
 * that have crept into projects.js (demo / liveDemo / LiveDemo / live).
 * Returns null for missing values and for placeholder URLs such as
 * "https://github.com/", which would otherwise send visitors to a homepage.
 */
function pickUrl(project, keys) {
  for (const key of keys) {
    const raw = project[key];
    if (typeof raw !== 'string') continue;
    const url = raw.trim();
    if (!url) continue;
    // Reject bare-host placeholders: no path after the domain.
    if (/^https?:\/\/(www\.)?(github\.com|linkedin\.com|scholar\.google\.com)\/?$/i.test(url)) continue;
    return url;
  }
  return null;
}

export default function ProjectCard({ project }) {
  const [imgError, setImgError] = useState(false);

  const codeUrl = pickUrl(project, ['github', 'repo', 'code']);
  const demoUrl = pickUrl(project, ['demo', 'liveDemo', 'LiveDemo', 'live', 'website']);
  const scholarUrl = pickUrl(project, ['GoogleScholar', 'googleScholar', 'scholar', 'paper']);

  return (
    <GlassCard className={styles.card}>
      <div className={styles.media}>
        {!imgError ? (
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.mediaFallback} aria-hidden="true">
            <span>{project.title.split(' ').map((w) => w[0]).slice(0, 2).join('')}</span>
          </div>
        )}
        {project.featured && <span className={styles.featuredTag}>Featured</span>}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.tags}>
          {(project.tags || []).map((t, i) => (
            <Badge key={`${t}-${i}`}>{t}</Badge>
          ))}
        </div>

        {(codeUrl || demoUrl || scholarUrl) && (
          <div className={styles.links}>
            {codeUrl && (
              <a href={codeUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <FaGithub aria-hidden="true" /> Code
              </a>
            )}
            {demoUrl && (
              <a href={demoUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <FaExternalLinkAlt aria-hidden="true" /> Live Demo
              </a>
            )}
            {scholarUrl && (
              <a href={scholarUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                <FaGraduationCap aria-hidden="true" /> Publication
              </a>
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
}
