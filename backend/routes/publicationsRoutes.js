const express = require('express');
const { getPublications } = require('../controllers/publicationsController');

const router = express.Router();

// GET /api/publications?search=&sort=
router.get('/', getPublications);

module.exports = router;
