import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaTachometerAlt, FaList, FaUserEdit, FaCertificate, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import styles from '../../pages/Dashboard.module.css';

export default function DashboardLayout({ children, activeTab, setActiveTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <FaTachometerAlt /> },
    { id: 'navbar', label: 'Navbar Manager', icon: <FaList /> },
    { id: 'profile', label: 'Profile Editor', icon: <FaUserEdit /> },
    { id: 'certificates', label: 'Certificates', icon: <FaCertificate /> },
    { id: 'settings', label: 'Account Settings', icon: <FaCog /> },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className={styles.mobileOverlay} 
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 95 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🌊</span>
            Dashboard
          </div>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`${styles.navItem} ${activeTab === item.id ? styles.navItemActive : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.logoutBtn} onClick={logout}>
            <FaSignOutAlt />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setMobileMenuOpen(true)}
          >
            <FaBars />
          </button>
          
          <div className={styles.userInfo}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
              {user?.fullName || 'Admin'}
            </span>
            <span style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-sunken)', borderRadius: '4px', fontSize: '0.75rem' }}>
              {user?.role || 'admin'}
            </span>
          </div>
        </header>

        <div className={styles.contentArea}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
