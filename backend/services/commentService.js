const { v4: uuidv4 } = require('uuid');
const JsonStore = require('../utils/JsonStore');
const ApiError = require('../utils/ApiError');

const store = new JsonStore('comments.json');

async function getAll() {
  const comments = await store.read();
  return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

async function create({ name, organization = '', avatar = '', message, parentId = null }) {
  const comments = await store.read();

  if (parentId) {
    const parentExists = comments.some((c) => c.id === parentId);
    if (!parentExists) throw new ApiError(404, 'Parent comment not found');
  }

  const comment = {
    id: uuidv4(),
    name: name.trim(),
    organization: organization.trim(),
    avatar: avatar.trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    likes: 0,
    parentId: parentId || null,
  };

  comments.push(comment);
  await store.write(comments);
  return comment;
}

async function like(id) {
  const comments = await store.read();
  const comment = comments.find((c) => c.id === id);
  if (!comment) throw new ApiError(404, 'Comment not found');
  comment.likes += 1;
  await store.write(comments);
  return comment;
}

async function remove(id) {
  const comments = await store.read();
  const exists = comments.some((c) => c.id === id);
  if (!exists) throw new ApiError(404, 'Comment not found');
  // Remove the comment and any direct replies to it.
  const remaining = comments.filter((c) => c.id !== id && c.parentId !== id);
  await store.write(remaining);
}

module.exports = { getAll, create, like, remove };
