import { motion } from 'framer-motion';
import { FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { experience } from '../../data/experience.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import styles from './Experience.module.css';

export default function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · EXPERIENCE"
          title="A chronological record"
          description="Each role tracked in order, the way a station gauge records a hydrograph — because sequence here carries real information."
        />

        <ol className={styles.timeline}>
          {experience.map((role, i) => (
            <motion.li
              key={role.id}
              className={styles.entry}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, delay: (i % 4) * 0.06 }}
            >
              <div className={styles.marker}>
                <span className={styles.markerDot} />
                {i !== experience.length - 1 && <span className={styles.markerLine} />}
              </div>

              <GlassCard className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.role}>
                      <FaBriefcase aria-hidden="true" className={styles.roleIcon} />
                      {role.title}
                    </h3>
                    <p className={styles.org}>{role.org}</p>
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.date}>{role.date}</span>
                    <span className={styles.location}>
                      <FaMapMarkerAlt aria-hidden="true" /> {role.location}
                    </span>
                  </div>
                </div>

                <ul className={styles.responsibilities}>
                  {role.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>

                {role.achievements?.length > 0 && (
                  <div className={styles.achievements}>
                    <span className={styles.achieveLabel}>Highlights</span>
                    <ul>
                      {role.achievements.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className={styles.tech}>
                  {role.technologies.map((t) => (
                    <Badge key={t} tone="signal">{t}</Badge>
                  ))}
                </div>
              </GlassCard>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
