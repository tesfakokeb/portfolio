const express = require('express');
const { getProjects } = require('../controllers/projectsController');

const router = express.Router();

// GET /api/projects?category=&search=
router.get('/', getProjects);

module.exports = router;
