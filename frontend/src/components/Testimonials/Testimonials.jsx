import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { testimonials } from '../../data/testimonials.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import styles from './Testimonials.module.css';

const AUTO_SLIDE_MS = 6000;

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(timerRef.current);
  }, [paused, next]);

  const current = testimonials[index];

  return (
    <section id="testimonials" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · TESTIMONIALS"
          title="What collaborators say"
          align="center"
        />

        <div
          className={styles.carousel}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button className={styles.navBtn} onClick={prev} aria-label="Previous testimonial">
            <FaChevronLeft aria-hidden="true" />
          </button>

          <div className={styles.stage}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <GlassCard className={styles.card}>
                  <FaQuoteLeft aria-hidden="true" className={styles.quoteIcon} />
                  <div className={styles.rating} aria-label={`${current.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} aria-hidden="true" className={i < current.rating ? styles.starOn : styles.starOff} />
                    ))}
                  </div>
                  <p className={styles.comment}>&ldquo;{current.comment}&rdquo;</p>
                  <div className={styles.person}>
                    <div className={styles.avatar}>{current.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
                    <div>
                      <p className={styles.name}>{current.name}</p>
                      <p className={styles.position}>
                        {current.position} &middot; {current.org}
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>

          <button className={styles.navBtn} onClick={next} aria-label="Next testimonial">
            <FaChevronRight aria-hidden="true" />
          </button>
        </div>

        <div className={styles.dots} role="tablist" aria-label="Select testimonial">
          {testimonials.map((t, i) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={i === index}
              aria-label={`Testimonial from ${t.name}`}
              className={`${styles.dot} ${i === index ? styles.dotActive : ''}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
