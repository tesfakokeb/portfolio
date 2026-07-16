import { motion } from 'framer-motion';
import { FaGraduationCap } from 'react-icons/fa';
import { profile } from '../../data/profile.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import StatCounter from './StatCounter.jsx';
import styles from './About.module.css';

export default function About() {
  return (
    <section id="about" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · ABOUT"
          title="Researcher, engineer, AI powered fullstack application developer, and builder of water-cycle tools"
          description="A brief look at the work, the training behind it, and what drives it."
        />

        <div className={styles.grid}>
          <motion.div
            className={styles.bio}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            {profile.bio.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}

            <div className={styles.pillars}>
              <GlassCard className={styles.pillar}>
                <span className={styles.pillarLabel}>Mission</span>
                <p>{profile.mission}</p>
              </GlassCard>
              <GlassCard className={styles.pillar}>
                <span className={styles.pillarLabel}>Research Philosophy</span>
                <p>{profile.philosophy}</p>
              </GlassCard>
            </div>
          </motion.div>

          <motion.div
            className={styles.side}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <GlassCard className={styles.educationCard}>
              <h3 className={styles.sideTitle}>
                <FaGraduationCap aria-hidden="true" /> Education
              </h3>
              <ul className={styles.eduList}>
                {profile.education.map((ed) => (
                  <li key={ed.degree}>
                    <span className={styles.eduYear}>{ed.year}</span>
                    <div>
                      <p className={styles.eduDegree}>{ed.degree}</p>
                      <p className={styles.eduSchool}>{ed.school}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        <div className={styles.stats}>
          {profile.stats.map((s) => (
            <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
