import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaGithub, FaLinkedin, FaFacebook, FaTwitter, FaGraduationCap, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { profile } from '../../data/profile.js';
import api from '../../utils/api.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import styles from './Contact.module.css';

const initialForm = { name: '', email: '', subject: '', message: '' };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Name is required.';
  if (!form.email.trim()) errors.email = 'Email is required.';
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Enter a valid email address.';
  if (!form.subject.trim()) errors.subject = 'Subject is required.';
  if (!form.message.trim()) errors.message = 'Message is required.';
  else if (form.message.trim().length < 10) errors.message = 'Message should be at least 10 characters.';
  return errors;
}

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validate(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus('loading');
    try {
      await api.post('/contact', form);
      setStatus('success');
      setForm(initialForm);
    } catch (err) {
      setStatus('error');
    } finally {
      setTimeout(() => setStatus((s) => (s === 'loading' ? 'idle' : s)), 100);
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactInfo = [
    { icon: FaEnvelope, label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
    { icon: FaPhone, label: 'Phone', value: profile.phone, href: `tel:${profile.phone.replace(/[^\d+]/g, '')}` },
    { icon: FaMapMarkerAlt, label: 'Location', value: profile.location, href: null },
  ];

  const socialLinks = [
    { icon: FaGithub, href: profile.social.github, label: 'GitHub' },
    { icon: FaLinkedin, href: profile.social.linkedin, label: 'LinkedIn' },
    { icon: FaGraduationCap, href: profile.social.scholar, label: 'Google Scholar' },
    { icon: FaFacebook, href: profile.social.facebook, label: 'Facebook' },
    { icon: FaTwitter, href: profile.social.twitter, label: 'Twitter' },
  ];

  return (
    <section id="contact" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · CONTACT"
          title="Get in touch"
          description="Open to research collaboration, consulting, and speaking opportunities."
        />

        <div className={styles.layout}>
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55 }}
          >
            <GlassCard className={styles.infoCard}>
              <ul className={styles.infoList}>
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <li key={label}>
                    <span className={styles.infoIcon}>
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <p className={styles.infoLabel}>{label}</p>
                      {href ? <a href={href} className={styles.infoValue}>{value}</a> : <p className={styles.infoValue}>{value}</p>}
                    </div>
                  </li>
                ))}
              </ul>

              <div className={styles.socials}>
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className={styles.socialIcon}>
                    <Icon aria-hidden="true" />
                  </a>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <GlassCard className={styles.formCard}>
              <form onSubmit={handleSubmit} className={styles.form} noValidate>
                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="f-name">Name</label>
                    <input id="f-name" type="text" value={form.name} onChange={handleChange('name')} aria-invalid={!!errors.name} />
                    {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
                  </div>
                  <div className={styles.field}>
                    <label htmlFor="f-email">Email</label>
                    <input id="f-email" type="email" value={form.email} onChange={handleChange('email')} aria-invalid={!!errors.email} />
                    {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                  </div>
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-subject">Subject</label>
                  <input id="f-subject" type="text" value={form.subject} onChange={handleChange('subject')} aria-invalid={!!errors.subject} />
                  {errors.subject && <span className={styles.fieldError}>{errors.subject}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="f-message">Message</label>
                  <textarea id="f-message" rows={5} value={form.message} onChange={handleChange('message')} aria-invalid={!!errors.message} />
                  {errors.message && <span className={styles.fieldError}>{errors.message}</span>}
                </div>

                <button type="submit" className={styles.submit} disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <span className={styles.spinner} aria-hidden="true" />
                  ) : (
                    <>
                      <FaPaperPlane aria-hidden="true" /> Send message
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {status === 'success' && (
                    <motion.p
                      className={styles.success}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <FaCheckCircle aria-hidden="true" /> Message sent — thank you, I'll reply soon.
                    </motion.p>
                  )}
                  {status === 'error' && (
                    <motion.p
                      className={styles.errorMsg}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      <FaExclamationCircle aria-hidden="true" /> Something went wrong. Please email me directly at {profile.email}.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
