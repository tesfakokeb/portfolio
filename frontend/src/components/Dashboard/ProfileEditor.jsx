import { useState, useEffect, useRef } from 'react';
import { FaSave, FaUpload, FaSpinner } from 'react-icons/fa';
import { useApi } from '../../hooks/useApi';
import { resolveFileUrl } from '../../utils/apiBase';
import styles from '../../pages/Dashboard.module.css';

export default function ProfileEditor() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const avatarInputRef = useRef(null);
  const cvInputRef = useRef(null);
  const api = useApi();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api('/api/dashboard/profile');
      setProfile(data.profile);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const data = await api('/api/dashboard/profile', {
        method: 'PUT',
        body: JSON.stringify(profile),
      });
      setProfile(data.profile);
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    const isAvatar = type === 'avatar';
    
    formData.append(isAvatar ? 'avatar' : 'cv', file);
    
    if (isAvatar) setUploadingAvatar(true);
    else setUploadingCV(true);
    
    setMessage({ type: '', text: '' });

    try {
      const endpoint = isAvatar ? '/api/dashboard/upload/profile-picture' : '/api/dashboard/upload/cv';
      const data = await api(endpoint, {
        method: 'POST',
        body: formData, // useApi hook won't set Content-Type for FormData
      });
      
      // Update local profile state with new URL
      setProfile(prev => ({
        ...prev,
        [isAvatar ? 'profile_picture_url' : 'cv_url']: isAvatar ? data.profilePictureUrl : data.cvUrl
      }));
      
      setMessage({ type: 'success', text: data.message });
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      if (isAvatar) setUploadingAvatar(false);
      else setUploadingCV(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;
  if (!profile) return <div>No profile data found. Please run the seed script.</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Profile Information</h2>
      </div>

      {message.text && (
        <div className={`${styles.alert} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '3rem' }}>
        
        {/* Main Form */}
        <form onSubmit={handleSave}>
          <div className={styles.formGrid} style={{ marginBottom: '1.5rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                className={styles.input}
                value={profile.full_name || ''}
                onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Credentials (e.g., Ph.D.)</label>
              <input
                type="text"
                className={styles.input}
                value={profile.credentials || ''}
                onChange={(e) => setProfile({...profile, credentials: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Role / Title</label>
              <input
                type="text"
                className={styles.input}
                value={profile.role_title || ''}
                onChange={(e) => setProfile({...profile, role_title: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Organization</label>
              <input
                type="text"
                className={styles.input}
                value={profile.organization || ''}
                onChange={(e) => setProfile({...profile, organization: e.target.value})}
              />
            </div>
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.label}>Short Summary (Hero Section)</label>
            <textarea
              className={styles.textarea}
              style={{ minHeight: '80px' }}
              value={profile.summary || ''}
              onChange={(e) => setProfile({...profile, summary: e.target.value})}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
            <label className={styles.label}>Full Bio (About Section)</label>
            <textarea
              className={styles.textarea}
              value={profile.bio || ''}
              onChange={(e) => setProfile({...profile, bio: e.target.value})}
            />
          </div>

          <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
            Contact & Links
          </h3>

          <div className={styles.formGrid} style={{ marginBottom: '2rem' }}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Public Email</label>
              <input
                type="email"
                className={styles.input}
                value={profile.email || ''}
                onChange={(e) => setProfile({...profile, email: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone</label>
              <input
                type="text"
                className={styles.input}
                value={profile.phone || ''}
                onChange={(e) => setProfile({...profile, phone: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Location</label>
              <input
                type="text"
                className={styles.input}
                value={profile.location || ''}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>LinkedIn URL</label>
              <input
                type="url"
                className={styles.input}
                value={profile.linkedin_url || ''}
                onChange={(e) => setProfile({...profile, linkedin_url: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>GitHub URL</label>
              <input
                type="url"
                className={styles.input}
                value={profile.github_url || ''}
                onChange={(e) => setProfile({...profile, github_url: e.target.value})}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Google Scholar URL</label>
              <input
                type="url"
                className={styles.input}
                value={profile.scholar_url || ''}
                onChange={(e) => setProfile({...profile, scholar_url: e.target.value})}
              />
            </div>
          </div>

          <button type="submit" className={styles.button} disabled={saving}>
            {saving ? <FaSpinner className="fa-spin" /> : <FaSave />}
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </form>

        {/* Media Uploads */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Avatar Upload */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Profile Picture</h3>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              {profile.profile_picture_url ? (
                <img src={resolveFileUrl(profile.profile_picture_url)} alt="Profile Preview" className={styles.avatarPreview} />
              ) : (
                <div className={styles.avatarPreview} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-sunken)', color: 'var(--text-muted)' }}>
                  No Image
                </div>
              )}
            </div>
            
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp" 
              style={{ display: 'none' }}
              ref={avatarInputRef}
              onChange={(e) => handleFileUpload(e, 'avatar')}
            />
            
            <button 
              className={styles.button} 
              style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              onClick={() => avatarInputRef.current.click()}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? <FaSpinner className="fa-spin" /> : <FaUpload />}
              {uploadingAvatar ? 'Uploading...' : 'Upload New Picture'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
              Max 5MB. JPG, PNG, WEBP.
            </p>
          </div>

          {/* CV Upload */}
          <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Curriculum Vitae</h3>
            
            {profile.cv_url && (
              <div style={{ padding: '0.75rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-s)', marginBottom: '1rem', fontSize: '0.85rem', wordBreak: 'break-all' }}>
                <a href={resolveFileUrl(profile.cv_url)} target="_blank" rel="noreferrer" style={{ color: 'var(--signal-blue)' }}>
                  View Current CV
                </a>
              </div>
            )}
            
            <input 
              type="file" 
              accept=".pdf,.doc,.docx" 
              style={{ display: 'none' }}
              ref={cvInputRef}
              onChange={(e) => handleFileUpload(e, 'cv')}
            />
            
            <button 
              className={styles.button} 
              style={{ width: '100%', background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
              onClick={() => cvInputRef.current.click()}
              disabled={uploadingCV}
            >
              {uploadingCV ? <FaSpinner className="fa-spin" /> : <FaUpload />}
              {uploadingCV ? 'Uploading...' : 'Upload New CV'}
            </button>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
              Max 10MB. PDF, DOC, DOCX.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
