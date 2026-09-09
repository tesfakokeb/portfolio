import { useState, useEffect, useRef } from 'react';
import { FaPlus, FaSave, FaTrash, FaEdit, FaTimes, FaUpload, FaSpinner, FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import { useApi } from '../../hooks/useApi';
import styles from '../../pages/Dashboard.module.css';
import { resolveFileUrl } from '../../utils/apiBase';

const emptyCert = {
  title: '',
  issuer: '',
  date: '',
  credential_id: '',
  credential_url: '',
  skills: '',
  image: null,
};

export default function CertificateManager() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyCert });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);
  const api = useApi();

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const data = await api('/api/certificates');
      setCertificates(data.certificates || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load certificates.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ ...emptyCert });
    setEditingId(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setForm({
      title: cert.title || '',
      issuer: cert.issuer || '',
      date: cert.date || '',
      credential_id: cert.credential_id || '',
      credential_url: cert.credential_url || '',
      skills: Array.isArray(cert.skills) ? cert.skills.join(', ') : '',
      image: null,
    });
    setShowForm(true);
    setMessage({ type: '', text: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('issuer', form.issuer);
      formData.append('date', form.date);
      formData.append('credential_id', form.credential_id);
      formData.append('credential_url', form.credential_url);
      formData.append('skills', form.skills);
      if (form.image) {
        formData.append('certificate', form.image);
      }

      const endpoint = editingId
        ? `/api/dashboard/certificates/${editingId}`
        : '/api/dashboard/certificates';

      const method = editingId ? 'PUT' : 'POST';

      await api(endpoint, { method, body: formData });

      setMessage({
        type: 'success',
        text: editingId ? 'Certificate updated successfully.' : 'Certificate created successfully.',
      });

      resetForm();
      fetchCertificates();
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;

    try {
      await api(`/api/dashboard/certificates/${id}`, { method: 'DELETE' });
      setMessage({ type: 'success', text: 'Certificate deleted.' });
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  };

  if (loading) return <div>Loading certificates...</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <FaCertificate style={{ marginRight: '0.5rem', color: 'var(--signal-blue)' }} />
          Certificates Manager
        </h2>
        {!showForm && (
          <button
            className={styles.button}
            onClick={() => { setShowForm(true); setEditingId(null); setForm({ ...emptyCert }); }}
          >
            <FaPlus /> Add Certificate
          </button>
        )}
      </div>

      {message.text && (
        <div className={`${styles.alert} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {/* ─── Add / Edit Form ─── */}
      {showForm && (
        <div style={{
          background: 'var(--bg-sunken)',
          borderRadius: 'var(--radius-m)',
          padding: '1.75rem',
          marginBottom: '2rem',
          border: '1px solid var(--border-soft)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
              {editingId ? 'Edit Certificate' : 'Add New Certificate'}
            </h3>
            <button
              className={styles.iconBtn}
              onClick={resetForm}
              style={{ fontSize: '1.1rem' }}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGrid} style={{ marginBottom: '1.5rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Machine Learning Specialization"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Issuer *</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Stanford University · Coursera"
                  value={form.issuer}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="e.g. 2024"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Credential ID</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Optional credential ID"
                  value={form.credential_id}
                  onChange={(e) => setForm({ ...form, credential_id: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Credential URL</label>
                <input
                  type="url"
                  className={styles.input}
                  placeholder="https://..."
                  value={form.credential_url}
                  onChange={(e) => setForm({ ...form, credential_url: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Skills (comma-separated)</label>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Python, TensorFlow, Deep Learning"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>
            </div>

            {/* Image upload */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className={styles.label} style={{ marginBottom: '0.5rem', display: 'block' }}>
                Certificate Image / PDF
              </label>
              <div
                className={styles.uploadZone}
                onClick={() => fileInputRef.current?.click()}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}
              >
                <FaUpload className={styles.uploadIcon} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {form.image ? form.image.name : 'Click to upload certificate image or PDF'}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Max 5MB. JPG, PNG, WEBP, PDF.
                </span>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.pdf"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => setForm({ ...form, image: e.target.files[0] || null })}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className={styles.button} disabled={saving}>
                {saving ? <FaSpinner className="fa-spin" /> : <FaSave />}
                {saving ? 'Saving...' : editingId ? 'Update Certificate' : 'Create Certificate'}
              </button>
              <button
                type="button"
                className={styles.button}
                style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ─── Certificate List ─── */}
      {certificates.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem 0' }}>
          No certificates yet. Click "Add Certificate" to create one.
        </p>
      ) : (
        <div className={styles.list}>
          {certificates.map((cert) => (
            <div key={cert.id} className={styles.listItem} style={{ alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', flex: 1, alignItems: 'flex-start' }}>
                {/* Thumbnail */}
                {cert.image_url && (
                  <a
                    href={resolveFileUrl(cert.image_url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flexShrink: 0 }}
                  >
                    {cert.image_url.endsWith('.pdf') ? (
                      <div style={{
                        width: 64, height: 64,
                        borderRadius: 'var(--radius-s)',
                        background: 'var(--gradient-signal)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.75rem',
                      }}>
                        PDF
                      </div>
                    ) : (
                      <img
                        src={resolveFileUrl(cert.image_url)}
                        alt={cert.title}
                        style={{
                          width: 64, height: 64,
                          objectFit: 'cover',
                          borderRadius: 'var(--radius-s)',
                          border: '1px solid var(--border-soft)',
                        }}
                      />
                    )}
                  </a>
                )}

                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                    {cert.title}
                  </div>
                  <div style={{ fontSize: '0.87rem', color: 'var(--hydro-teal)', marginBottom: '0.3rem' }}>
                    {cert.issuer}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {cert.date && <span>{cert.date}</span>}
                    {cert.credential_id && <span>ID: {cert.credential_id}</span>}
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: 'var(--signal-blue)', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <FaExternalLinkAlt style={{ fontSize: '0.65rem' }} /> Verify
                      </a>
                    )}
                  </div>
                  {cert.skills?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                      {cert.skills.map((s) => (
                        <span
                          key={s}
                          style={{
                            fontSize: '0.72rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(46, 125, 209, 0.1)',
                            color: 'var(--signal-blue)',
                            fontWeight: 500,
                          }}
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.itemActions}>
                <button className={styles.iconBtn} onClick={() => handleEdit(cert)} title="Edit">
                  <FaEdit />
                </button>
                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(cert.id)} title="Delete">
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
