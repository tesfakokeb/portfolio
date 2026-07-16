const express = require('express');
const {
  getComments,
  createComment,
  likeComment,
  deleteComment,
} = require('../controllers/commentsController');
const { validateComment } = require('../middleware/validators');

const router = express.Router();

// GET /api/comments
router.get('/', getComments);

// POST /api/comments
router.post('/', validateComment, createComment);

// PUT /api/comments/:id/like
router.put('/:id/like', likeComment);

// DELETE /api/comments/:id
router.delete('/:id', deleteComment);

module.exports = router;
