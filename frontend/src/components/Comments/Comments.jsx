import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaPaperPlane } from 'react-icons/fa';
import api from '../../utils/api.js';
import { demoComments } from './demoComments.js';
import SectionHeading from '../ui/SectionHeading.jsx';
import GlassCard from '../ui/GlassCard.jsx';
import CommentCard from './CommentCard.jsx';
import styles from './Comments.module.css';

const PAGE_SIZE = 5;

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const [form, setForm] = useState({ name: '', organization: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/comments');
      setComments(data.comments ?? data);
      setOffline(false);
    } catch (err) {
      // Backend not reachable (e.g. static preview) — fall back to demo data.
      setComments(demoComments);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const topLevel = useMemo(() => comments.filter((c) => !c.parentId), [comments]);
  const repliesFor = useCallback((id) => comments.filter((c) => c.parentId === id), [comments]);

  const filteredSorted = useMemo(() => {
    let list = topLevel.filter(
      (c) =>
        query.trim() === '' ||
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.message.toLowerCase().includes(query.toLowerCase())
    );
    list = [...list].sort((a, b) =>
      sort === 'newest'
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : sort === 'oldest'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : b.likes - a.likes
    );
    return list;
  }, [topLevel, query, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const paged = filteredSorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleLike = async (id) => {
    setComments((prev) => prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c)));
    if (!offline) {
      try {
        await api.put(`/comments/${id}/like`);
      } catch {
        // Optimistic update stands even if the request fails silently.
      }
    }
  };

  const handleReply = async (parentId, { name, message }) => {
    const optimistic = {
      id: `local-${Date.now()}`,
      name,
      organization: '',
      avatar: '',
      message,
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId,
    };
    setComments((prev) => [...prev, optimistic]);
    if (!offline) {
      try {
        await api.post('/comments', optimistic);
      } catch {
        // Keep optimistic reply even if sync fails.
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) return;
    setSubmitting(true);
    setSubmitError('');

    const payload = {
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      organization: form.organization.trim(),
      avatar: '',
      message: form.message.trim(),
      createdAt: new Date().toISOString(),
      likes: 0,
      parentId: null,
    };

    try {
      if (!offline) {
        await api.post('/comments', payload);
      }
      setComments((prev) => [payload, ...prev]);
      setForm({ name: '', organization: '', message: '' });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 2500);
    } catch (err) {
      setSubmitError('Could not post your comment right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="comments" className="section">
      <div className="container">
        <SectionHeading
          eyebrow="SIG · COMMENTS"
          title="Guestbook"
          description="Leave a note, ask a question, or say hello — visible to anyone who visits this page."
        />

        <div className={styles.layout}>
          <GlassCard className={styles.formCard}>
            <h3 className={styles.formTitle}>Leave a comment</h3>
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="c-name">Name</label>
                  <input
                    id="c-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="c-org">Organization (optional)</label>
                  <input
                    id="c-org"
                    type="text"
                    value={form.organization}
                    onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label htmlFor="c-message">Message</label>
                <textarea
                  id="c-message"
                  rows={3}
                  required
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
              </div>
              {submitError && <p className={styles.error}>{submitError}</p>}
              {offline && <p className={styles.notice}>Demo mode: backend not connected, comments are saved locally for this session.</p>}
              <button type="submit" className={styles.submit} disabled={submitting}>
                {submitting ? 'Posting…' : (
                  <>
                    <FaPaperPlane aria-hidden="true" /> Post comment
                  </>
                )}
              </button>
              {submitted && <p className={styles.success}>Thanks — your comment was posted.</p>}
            </form>
          </GlassCard>

          <div className={styles.listWrap}>
            <div className={styles.controls}>
              <div className={styles.searchBox}>
                <FaSearch aria-hidden="true" className={styles.searchIcon} />
                <input
                  type="search"
                  placeholder="Search comments…"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  aria-label="Search comments"
                />
              </div>
              <select
                className={styles.sortSelect}
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort comments"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most liked</option>
              </select>
            </div>

            {loading ? (
              <p className={styles.loading}>Loading comments…</p>
            ) : paged.length === 0 ? (
              <p className={styles.loading}>No comments yet — be the first to say hello.</p>
            ) : (
              <motion.div layout className={styles.list}>
                {paged.map((c) => (
                  <div key={c.id}>
                    <CommentCard comment={c} onLike={handleLike} onReply={handleReply} />
                    {repliesFor(c.id).map((r) => (
                      <CommentCard key={r.id} comment={r} onLike={handleLike} isReply />
                    ))}
                  </div>
                ))}
              </motion.div>
            )}

            {totalPages > 1 && (
              <div className={styles.pagination}>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.pageBtn} ${page === i + 1 ? styles.pageActive : ''}`}
                    onClick={() => setPage(i + 1)}
                    aria-current={page === i + 1 ? 'page' : undefined}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
