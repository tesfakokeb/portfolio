import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import { projects, projectCategories } from '../../data/projects.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import ProjectCard from './ProjectCard.jsx';
import styles from './Projects.module.css';

export default function Projects() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category;
      const matchesQuery =
        query.trim() === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <section id="projects" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · PROJECTS"
          title="Selected projects"
          description="Applied tools spanning hydrological modeling, remote sensing pipelines, and full-stack platforms."
        />

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch aria-hidden="true" className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search projects or technologies…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search projects"
            />
          </div>

          <div className={styles.filters}>
            {projectCategories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${category === cat ? styles.filterActive : ''}`}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className={styles.empty}>No projects match your search. Try a different term or filter.</p>
        )}
      </div>
    </section>
  );
}
