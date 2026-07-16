const commentService = require('../services/commentService');
const asyncHandler = require('../utils/asyncHandler');

const getComments = asyncHandler(async (req, res) => {
  const comments = await commentService.getAll();
  res.status(200).json({ success: true, count: comments.length, comments });
});

const createComment = asyncHandler(async (req, res) => {
  const { name, organization, avatar, message, parentId } = req.body;
  const comment = await commentService.create({ name, organization, avatar, message, parentId });
  res.status(201).json({ success: true, comment });
});

const likeComment = asyncHandler(async (req, res) => {
  const comment = await commentService.like(req.params.id);
  res.status(200).json({ success: true, comment });
});

const deleteComment = asyncHandler(async (req, res) => {
  await commentService.remove(req.params.id);
  res.status(200).json({ success: true, message: 'Comment deleted' });
});

module.exports = { getComments, createComment, likeComment, deleteComment };
