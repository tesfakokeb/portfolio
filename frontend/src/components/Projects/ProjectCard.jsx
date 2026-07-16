import { useState } from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project }) {
  const [imgError, setImgError] = useState(false);

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
          {project.tags.map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div className={styles.links}>
          <a href={project.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <FaGithub aria-hidden="true" /> Code
          </a>
          <a href={project.demo} target="_blank" rel="noopener noreferrer" className={styles.link}>
            <FaExternalLinkAlt aria-hidden="true" /> Live Demo
          </a>
        </div>
      </div>
    </GlassCard>
  );
}
