import { useState } from 'react';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import styles from '../../pages/Dashboard.module.css';

export default function AccountSettings() {
  const { user } = useAuth();
  const api = useApi();
  
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      return setStatus({ type: 'error', message: 'New passwords do not match' });
    }

    if (passwords.newPassword.length < 8) {
      return setStatus({ type: 'error', message: 'New password must be at least 8 characters' });
    }

    setLoading(true);

    try {
      const data = await api('/api/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      });
      
      setStatus({ type: 'success', message: data.message });
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Account Settings</h2>
      </div>
      
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'var(--bg-sunken)', borderRadius: 'var(--radius-s)' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Account Information</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          <strong>Name:</strong> {user?.fullName}
        </p>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
          <strong>Email:</strong> {user?.email}
        </p>
        <p style={{ color: 'var(--text-secondary)' }}>
          <strong>Role:</strong> <span style={{ textTransform: 'capitalize' }}>{user?.role}</span>
        </p>
      </div>

      <div style={{ maxWidth: '400px' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-soft)', paddingBottom: '0.5rem' }}>
          Change Password
        </h3>
        
        {status.message && (
          <div className={`${styles.alert} ${styles[status.type]}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.formGroup}>
          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Current Password</label>
            <input
              type="password"
              className={styles.input}
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>New Password</label>
            <input
              type="password"
              className={styles.input}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              required
            />
          </div>
          
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.label}>Confirm New Password</label>
            <input
              type="password"
              className={styles.input}
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              required
            />
          </div>
          
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <FaSpinner className="fa-spin" /> : <FaLock />}
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
