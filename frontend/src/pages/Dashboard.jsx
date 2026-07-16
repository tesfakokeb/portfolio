import { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import NavbarManager from '../components/Dashboard/NavbarManager';
import ProfileEditor from '../components/Dashboard/ProfileEditor';
import CertificateManager from '../components/Dashboard/CertificateManager';
import AccountSettings from '../components/Dashboard/AccountSettings';
import styles from './Dashboard.module.css';

function Overview() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Welcome to your Dashboard</h2>
      </div>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Use the sidebar on the left to navigate through your portfolio management tools.
        <br /><br />
        - <strong>Navbar Manager:</strong> Add, edit, remove, and reorder the links in your public navigation bar.
        <br />
        - <strong>Profile Editor:</strong> Update your bio, social links, and upload a new resume or profile picture.
        <br />
        - <strong>Certificates:</strong> Add, edit, and delete professional certifications with image uploads.
        <br />
        - <strong>Account Settings:</strong> Change your admin password.
      </p>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <Overview />}
      {activeTab === 'navbar' && <NavbarManager />}
      {activeTab === 'profile' && <ProfileEditor />}
      {activeTab === 'certificates' && <CertificateManager />}
      {activeTab === 'settings' && <AccountSettings />}
    </DashboardLayout>
  );
}
