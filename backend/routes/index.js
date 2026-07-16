const express = require('express');
const contactRoutes = require('./contactRoutes');
const commentsRoutes = require('./commentsRoutes');
const projectsRoutes = require('./projectsRoutes');
const publicationsRoutes = require('./publicationsRoutes');
const authRoutes = require('./authRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const certificatesRoutes = require('./certificatesRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Tesfa Worku Meshesha — portfolio API',
    endpoints: ['/api/contact', '/api/comments', '/api/projects', '/api/publications', '/api/certificates', '/api/auth', '/api/dashboard', '/api/health'],
  });
});

router.get('/health', (req, res) => {
  res.json({ success: true, status: 'ok', uptime: process.uptime() });
});

router.use('/contact', contactRoutes);
router.use('/comments', commentsRoutes);
router.use('/projects', projectsRoutes);
router.use('/publications', publicationsRoutes);
router.use('/auth', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/certificates', certificatesRoutes);

module.exports = router;

