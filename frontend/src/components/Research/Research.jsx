import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import { research, researchCategories } from '../../data/research.js';
import { getIcon } from '../../utils/iconMap.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import styles from './Research.module.css';

export default function Research() {
  const [category, setCategory] = useState('All');
  const [expanded, setExpanded] = useState(null);

  const filtered = useMemo(
    () => (category === 'All' ? research : research.filter((r) => r.category === category)),
    [category]
  );

  return (
    <section id="research" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · RESEARCH"
          title="Research areas"
          description="Core lines of inquiry spanning hydrology, remote sensing, AI-powered application, and machine learning."
        />

        <div className={styles.filters} role="tablist" aria-label="Filter research by category">
          {researchCategories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={category === cat}
              className={`${styles.filterBtn} ${category === cat ? styles.filterActive : ''}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((r) => {
              const Icon = getIcon(r.icon);
              const isOpen = expanded === r.id;
              return (
                <motion.div
                  key={r.id}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlassCard className={styles.card}>
                    <div className={styles.iconWrap}>
                      <Icon aria-hidden="true" />
                    </div>
                    <h3 className={styles.title}>{r.title}</h3>
                    <span className={styles.category}>{r.category}</span>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.p
                          className={styles.description}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {r.description}
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <button
                      className={styles.learnMore}
                      onClick={() => setExpanded(isOpen ? null : r.id)}
                      aria-expanded={isOpen}
                    >
                      {isOpen ? 'Show less' : 'Learn more'}
                      <FaArrowRight aria-hidden="true" className={isOpen ? styles.rotated : ''} />
                    </button>
                  </GlassCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
