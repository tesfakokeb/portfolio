const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = null;

/**
 * Lazily creates and caches the Nodemailer transporter.
 * Returns null if SMTP credentials are not configured (e.g. local dev
 * without a mail account) so callers can degrade gracefully.
 */
function getTransporter() {
  if (transporter) return transporter;
  if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
    return null;
  }
  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });
  return transporter;
}

module.exports = { getTransporter };
