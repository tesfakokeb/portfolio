const express = require('express');
const { sendContactMessage } = require('../controllers/contactController');
const { validateContact } = require('../middleware/validators');
const { contactLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// POST /api/contact
router.post('/', contactLimiter, validateContact, sendContactMessage);

module.exports = router;
