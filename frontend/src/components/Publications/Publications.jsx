import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaExternalLinkAlt, FaGraduationCap, FaQuoteRight, FaCheck } from 'react-icons/fa';
import { publications } from '../../data/publications.js';
import { profile } from '../../data/profile.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import styles from './Publications.module.css';

function toBibtex(pub) {
  const firstAuthorLast = pub.authors.split(',')[0].trim();
  const key = `${firstAuthorLast.split(' ')[0]}${pub.year}`;
  return `@article{${key},
  title   = {${pub.title}},
  author  = {${pub.authors}},
  journal = {${pub.journal}},
  year    = {${pub.year}},
  doi     = {${pub.doi}}
}`;
}

export default function Publications() {
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    let list = publications.filter(
      (p) =>
        query.trim() === '' ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.journal.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) => (sort === 'newest' ? b.year - a.year : a.year - b.year));
    return list;
  }, [query, sort]);

  const copyBibtex = async (pub) => {
    try {
      await navigator.clipboard.writeText(toBibtex(pub));
      setCopiedId(pub.id);
      setTimeout(() => setCopiedId(null), 1800);
    } catch {
      // Clipboard API unavailable — fail silently, user can select text manually.
    }
  };

  return (
    <section id="publications" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · PUBLICATIONS"
          title="Peer-reviewed publications"
          description="Journal articles and research output, searchable and sortable."
        />

        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <FaSearch aria-hidden="true" className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search by title or journal…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search publications"
            />
          </div>
          <div className={styles.sortGroup} role="radiogroup" aria-label="Sort publications">
            <button
              className={`${styles.sortBtn} ${sort === 'newest' ? styles.sortActive : ''}`}
              onClick={() => setSort('newest')}
            >
              Newest first
            </button>
            <button
              className={`${styles.sortBtn} ${sort === 'oldest' ? styles.sortActive : ''}`}
              onClick={() => setSort('oldest')}
            >
              Oldest first
            </button>
          </div>
        </div>

        <div className={styles.list}>
          <AnimatePresence mode="popLayout">
            {filtered.map((pub) => (
              <motion.div
                key={pub.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
              >
                <GlassCard className={styles.card}>
                  <div className={styles.cardMain}>
                    <span className={styles.year}>{pub.year}</span>
                    <div>
                      <h3 className={styles.title}>{pub.title}</h3>
                      <p className={styles.authors}>{pub.authors}</p>
                      <p className={styles.journal}>
                        {pub.journal} &middot; {pub.type}
                      </p>
                    </div>
                  </div>
                  <div className={styles.actions}>
                    <a
                      href={`https://doi.org/${pub.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionLink}
                    >
                      <FaExternalLinkAlt aria-hidden="true" /> DOI
                    </a>
                    <a
                      href={profile.social.scholar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.actionLink}
                    >
                      <FaGraduationCap aria-hidden="true" /> Scholar
                    </a>
                    <button className={styles.actionLink} onClick={() => copyBibtex(pub)}>
                      {copiedId === pub.id ? (
                        <>
                          <FaCheck aria-hidden="true" /> Copied
                        </>
                      ) : (
                        <>
                          <FaQuoteRight aria-hidden="true" /> BibTeX
                        </>
                      )}
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && <p className={styles.empty}>No publications match your search.</p>}
      </div>
    </section>
  );
}
