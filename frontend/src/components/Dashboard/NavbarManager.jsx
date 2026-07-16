import { useState, useEffect } from 'react';
import { FaTrash, FaEdit, FaPlus, FaGripVertical, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useApi } from '../../hooks/useApi';
import styles from '../../pages/Dashboard.module.css';

export default function NavbarManager() {
  const [navItems, setNavItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ label: '', href: '' });
  
  const api = useApi();

  useEffect(() => {
    fetchNavItems();
  }, []);

  const fetchNavItems = async () => {
    try {
      const data = await api('/api/dashboard/navbar');
      setNavItems(data.navItems);
    } catch (err) {
      setError('Failed to load navbar items');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingItem) {
        await api(`/api/dashboard/navbar/${editingItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
        setSuccess('Navbar item updated');
      } else {
        await api('/api/dashboard/navbar', {
          method: 'POST',
          body: JSON.stringify(formData),
        });
        setSuccess('Navbar item created');
      }
      
      setFormData({ label: '', href: '' });
      setEditingItem(null);
      fetchNavItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      await api(`/api/dashboard/navbar/${id}`, { method: 'DELETE' });
      setSuccess('Item deleted');
      fetchNavItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleVisibility = async (item) => {
    try {
      await api(`/api/dashboard/navbar/${item.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_visible: !item.is_visible }),
      });
      fetchNavItems();
    } catch (err) {
      setError(err.message);
    }
  };

  const moveItem = async (index, direction) => {
    if (
      (direction === -1 && index === 0) || 
      (direction === 1 && index === navItems.length - 1)
    ) return;

    const newItems = [...navItems];
    const temp = newItems[index];
    newItems[index] = newItems[index + direction];
    newItems[index + direction] = temp;
    
    // Update local state immediately for snappy UI
    setNavItems(newItems);

    // Prepare order array for backend
    const order = newItems.map((item, i) => ({
      id: item.id,
      sort_order: i + 1,
    }));

    try {
      await api('/api/dashboard/navbar/reorder', {
        method: 'PUT',
        body: JSON.stringify({ order }),
      });
    } catch (err) {
      setError('Failed to save order');
      fetchNavItems(); // Revert on failure
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>Navbar Manager</h2>
      </div>

      {error && <div className={`${styles.alert} ${styles.error}`}>{error}</div>}
      {success && <div className={`${styles.alert} ${styles.success}`}>{success}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        {/* List of items */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Current Items</h3>
          <div className={styles.list}>
            {navItems.map((item, index) => (
              <div key={item.id} className={styles.listItem} style={{ opacity: item.is_visible ? 1 : 0.6 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', marginRight: '0.5rem' }}>
                    <button 
                      onClick={() => moveItem(index, -1)} 
                      disabled={index === 0}
                      style={{ border: 'none', background: 'none', cursor: index === 0 ? 'default' : 'pointer', fontSize: '1.2rem', color: index === 0 ? 'transparent' : 'var(--text-secondary)' }}
                    >
                      &#9650;
                    </button>
                    <button 
                      onClick={() => moveItem(index, 1)} 
                      disabled={index === navItems.length - 1}
                      style={{ border: 'none', background: 'none', cursor: index === navItems.length - 1 ? 'default' : 'pointer', fontSize: '1.2rem', color: index === navItems.length - 1 ? 'transparent' : 'var(--text-secondary)' }}
                    >
                      &#9660;
                    </button>
                  </div>
                  <FaGripVertical className={styles.dragHandle} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.href}</div>
                  </div>
                </div>
                
                <div className={styles.itemActions}>
                  <button 
                    className={styles.iconBtn} 
                    onClick={() => toggleVisibility(item)}
                    title={item.is_visible ? 'Hide from navbar' : 'Show in navbar'}
                  >
                    {item.is_visible ? <FaEye /> : <FaEyeSlash />}
                  </button>
                  <button 
                    className={styles.iconBtn} 
                    onClick={() => { setEditingItem(item); setFormData({ label: item.label, href: item.href }); }}
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className={`${styles.iconBtn} ${styles.danger}`} 
                    onClick={() => handleDelete(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        <div>
          <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>
            {editingItem ? 'Edit Item' : 'Add New Item'}
          </h3>
          <form onSubmit={handleSubmit} className={styles.formGroup} style={{ background: 'var(--bg-sunken)', padding: '1.5rem', borderRadius: 'var(--radius-s)' }}>
            <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
              <label className={styles.label}>Label</label>
              <input
                type="text"
                className={styles.input}
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                required
                placeholder="e.g. About"
              />
            </div>
            
            <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
              <label className={styles.label}>Href (Link)</label>
              <input
                type="text"
                className={styles.input}
                value={formData.href}
                onChange={(e) => setFormData({...formData, href: e.target.value})}
                required
                placeholder="e.g. #about or /resume"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className={styles.button} style={{ flex: 1 }}>
                {editingItem ? 'Save Changes' : <><FaPlus /> Add Item</>}
              </button>
              
              {editingItem && (
                <button 
                  type="button" 
                  className={styles.button} 
                  style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)' }}
                  onClick={() => { setEditingItem(null); setFormData({ label: '', href: '' }); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
