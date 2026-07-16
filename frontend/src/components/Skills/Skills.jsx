import { motion } from 'framer-motion';
import { skillGroups } from '../../data/skills.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import SkillBar from './SkillBar.jsx';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <section id="skills" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · SKILLS"
          title="Technical toolkit"
          description="Programming, geospatial, modeling, and full-stack tools used day to day."
        />

        <div className={styles.grid}>
          {skillGroups.map((group, i) => (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 4) * 0.06 }}
            >
              <GlassCard className={styles.card}>
                <h3 className={styles.category}>{group.category}</h3>
                {group.skills.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} />
                ))}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
