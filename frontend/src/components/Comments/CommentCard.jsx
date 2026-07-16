import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaThumbsUp, FaReply } from 'react-icons/fa';
import styles from './CommentCard.module.css';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function CommentCard({ comment, onLike, onReply, isReply = false }) {
  const [liked, setLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyName, setReplyName] = useState('');

  const handleLike = () => {
    if (liked) return;
    setLiked(true);
    onLike(comment.id);
  };

  const submitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !replyName.trim()) return;
    onReply(comment.id, { name: replyName.trim(), message: replyText.trim() });
    setReplyText('');
    setReplyName('');
    setReplying(false);
  };

  const initials = comment.name.split(' ').map((n) => n[0]).slice(0, 2).join('');

  return (
    <motion.div
      className={`${styles.card} ${isReply ? styles.reply : ''}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className={styles.avatar}>
        {comment.avatar ? <img src={comment.avatar} alt="" /> : <span>{initials}</span>}
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.name}>{comment.name}</span>
          {comment.organization && <span className={styles.org}>{comment.organization}</span>}
          <span className={styles.time}>{timeAgo(comment.createdAt)}</span>
        </div>
        <p className={styles.message}>{comment.message}</p>
        <div className={styles.actions}>
          <button className={`${styles.actionBtn} ${liked ? styles.liked : ''}`} onClick={handleLike}>
            <FaThumbsUp aria-hidden="true" /> {comment.likes}
          </button>
          {!isReply && (
            <button className={styles.actionBtn} onClick={() => setReplying((v) => !v)}>
              <FaReply aria-hidden="true" /> Reply
            </button>
          )}
        </div>

        {replying && (
          <motion.form
            className={styles.replyForm}
            onSubmit={submitReply}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <input
              type="text"
              placeholder="Your name"
              value={replyName}
              onChange={(e) => setReplyName(e.target.value)}
              required
              aria-label="Your name"
            />
            <textarea
              placeholder="Write a reply…"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              required
              aria-label="Your reply"
            />
            <button type="submit" className={styles.replySubmit}>Post reply</button>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
}
