const express = require('express');
const { getCertificates } = require('../controllers/certificatesController');

const router = express.Router();

// Public route — no authentication required
router.get('/', getCertificates);

module.exports = router;
