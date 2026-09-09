const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');
const { pool } = require('../database/db');
const asyncHandler = require('../utils/asyncHandler');
const mailService = require('../services/mailService');

// Helper: generate JWT
function signToken(userId) {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

// ─── SIGNUP ────────────────────────────────────────────────────────────────────
const signup = asyncHandler(async (req, res) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Email, password, and full name are required.',
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters.',
    });
  }

  // Check for existing user
  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email.toLowerCase()]
  );

  if (existing.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'An account with this email already exists.',
    });
  }

  // Hash password & create user
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const [result] = await pool.execute(
    'INSERT INTO users (email, password_hash, full_name) VALUES (?, ?, ?)',
    [email.toLowerCase(), passwordHash, fullName]
  );

  const token = signToken(result.insertId);

  res.status(201).json({
    success: true,
    message: 'Account created successfully.',
    token,
    user: {
      id: result.insertId,
      email: email.toLowerCase(),
      fullName,
      role: 'admin',
    },
  });
});

// ─── LOGIN ─────────────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required.',
    });
  }

  const [rows] = await pool.execute(
    'SELECT id, email, password_hash, full_name, role FROM users WHERE email = ?',
    [email.toLowerCase()]
  );

  if (rows.length === 0) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const user = rows[0];
  const isValid = await bcrypt.compare(password, user.password_hash);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.',
    });
  }

  const token = signToken(user.id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
    },
  });
});

// ─── GET ME (current user) ─────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      fullName: req.user.full_name,
      role: req.user.role,
    },
  });
});

// ─── CHANGE PASSWORD ───────────────────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password and new password are required.',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 8 characters.',
    });
  }

  // Get current hash
  const [rows] = await pool.execute(
    'SELECT password_hash FROM users WHERE id = ?',
    [req.user.id]
  );

  const isValid = await bcrypt.compare(currentPassword, rows[0].password_hash);
  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect.',
    });
  }

  // Hash and update
  const salt = await bcrypt.genSalt(12);
  const newHash = await bcrypt.hash(newPassword, salt);

  await pool.execute(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [newHash, req.user.id]
  );

  res.status(200).json({
    success: true,
    message: 'Password updated successfully.',
  });
});

// ─── FORGOT PASSWORD ───────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required.',
    });
  }

  const [rows] = await pool.execute(
    'SELECT id, full_name FROM users WHERE email = ?',
    [email.toLowerCase()]
  );

  // Always return success to prevent email enumeration
  if (rows.length === 0) {
    return res.status(200).json({
      success: true,
      message: 'If an account with this email exists, a reset link has been sent.',
    });
  }

  const user = rows[0];

  // Generate reset token (url-safe random string)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await pool.execute(
    'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
    [resetTokenHash, expires, user.id]
  );

  // Build reset URL (frontend route)
  // config.clientUrl is the public frontend URL; clientOrigins[0] is always a
  // localhost default, which made every emailed reset link unusable.
  const resetUrl = `${config.clientUrl}/reset-password?token=${resetToken}`;

  // Send email using existing mail service
  try {
    await mailService.sendPasswordReset(email, user.full_name, resetUrl);
  } catch (mailErr) {
    // Clear the token if email fails
    await pool.execute(
      'UPDATE users SET reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
      [user.id]
    );
    console.error('[forgotPassword] Mail error:', mailErr.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send reset email. Please try again later.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'If an account with this email exists, a reset link has been sent.',
  });
});

// ─── RESET PASSWORD ────────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required.',
    });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 8 characters.',
    });
  }

  // Hash the provided token to compare with stored hash
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  const [rows] = await pool.execute(
    'SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
    [tokenHash]
  );

  if (rows.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token.',
    });
  }

  const userId = rows[0].id;

  // Hash new password & clear reset token
  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  await pool.execute(
    'UPDATE users SET password_hash = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
    [passwordHash, userId]
  );

  res.status(200).json({
    success: true,
    message: 'Password reset successfully. You can now log in.',
  });
});

module.exports = { signup, login, getMe, changePassword, forgotPassword, resetPassword };
