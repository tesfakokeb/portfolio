const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { pool } = require('../database/db');

/**
 * Middleware that protects routes by requiring a valid JWT.
 * Expects: Authorization: Bearer <token>
 */
async function protect(req, res, next) {
  try {
    // 1. Extract token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'Session expired. Please log in again.'
          : 'Invalid token. Please log in again.';
      return res.status(401).json({ success: false, message });
    }

    // 3. Check user still exists
    const [rows] = await pool.execute(
      'SELECT id, email, full_name, role FROM users WHERE id = ?',
      [decoded.userId]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.',
      });
    }

    // 4. Attach user to request
    req.user = rows[0];
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { protect };
