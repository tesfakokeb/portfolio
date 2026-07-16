import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt, FaCalendarAlt, FaSpinner } from 'react-icons/fa';
import { certificates as staticCertificates } from '../../data/certificates.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import Badge from '../ui/Badge.jsx';
import styles from './Certificates.module.css';

// Backend origin for resolving uploaded file URLs (e.g. /uploads/certificates/...)
const BACKEND_ORIGIN = import.meta.env.VITE_BACKEND_URL || '';

export default function Certificates() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates');
        if (!res.ok) throw new Error('API unavailable');
        const data = await res.json();
        if (data.certificates && data.certificates.length > 0) {
          setCertificates(data.certificates);
        } else {
          // Fallback to static data if API returns empty
          setCertificates(staticCertificates);
        }
      } catch {
        // Fallback to static data if API is unreachable
        setCertificates(staticCertificates);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <section id="certificates" className="section">
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <FaSpinner className="fa-spin" style={{ fontSize: '1.5rem', color: 'var(--text-muted)' }} />
        </div>
      </section>
    );
  }

  if (certificates.length === 0) return null;

  return (
    <section id="certificates" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · CERTIFICATES"
          title="Professional certifications"
          description="Verified credentials from industry-leading platforms and institutions."
        />

        <div className={styles.grid}>
          {certificates.map((cert, i) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: (i % 6) * 0.08 }}
            >
              <GlassCard className={styles.card}>
                {/* Certificate Image */}
                {cert.image_url && (
                  <div className={styles.imageWrap}>
                    {cert.image_url.endsWith('.pdf') ? (
                      <a
                        href={`${BACKEND_ORIGIN}${cert.image_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.pdfBadge}
                      >
                        <FaCertificate />
                        <span>View PDF</span>
                      </a>
                    ) : (
                      <img
                        src={`${BACKEND_ORIGIN}${cert.image_url}`}
                        alt={cert.title}
                        className={styles.certImage}
                        onClick={() => setLightbox(`${BACKEND_ORIGIN}${cert.image_url}`)}
                      />
                    )}
                  </div>
                )}

                {/* Header */}
                <div className={styles.cardHeader}>
                  {!cert.image_url && (
                    <span className={styles.iconWrap}>
                      <FaCertificate aria-hidden="true" />
                    </span>
                  )}
                  <div className={styles.headerText}>
                    <h3 className={styles.title}>{cert.title}</h3>
                    <p className={styles.issuer}>{cert.issuer}</p>
                  </div>
                </div>

                {/* Meta */}
                <div className={styles.meta}>
                  {cert.date && (
                    <span className={styles.date}>
                      <FaCalendarAlt aria-hidden="true" />
                      {cert.date}
                    </span>
                  )}
                  {(cert.credential_id || cert.credentialId) && (
                    <span className={styles.credentialId}>
                      ID: {cert.credential_id || cert.credentialId}
                    </span>
                  )}
                </div>

                {/* Skills */}
                {cert.skills?.length > 0 && (
                  <div className={styles.skills}>
                    {cert.skills.map((skill) => (
                      <Badge key={skill} tone="signal">{skill}</Badge>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {(cert.credential_url || cert.credentialUrl) && (
                  <div className={styles.actions}>
                    <a
                      href={cert.credential_url || cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.verifyLink}
                    >
                      <FaExternalLinkAlt aria-hidden="true" />
                      Verify Credential
                    </a>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightbox}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.img
              src={lightbox}
              alt="Certificate"
              className={styles.lightboxImage}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
