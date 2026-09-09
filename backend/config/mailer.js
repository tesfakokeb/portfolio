const nodemailer = require('nodemailer');
const config = require('./config');

let transporter = null;

/** True when every credential the transport needs is present. */
function isConfigured() {
  return Boolean(config.smtp.host && config.smtp.user && config.smtp.pass);
}

/** Lists which SMTP settings are missing, for logging and error detail. */
function missingSettings() {
  const missing = [];
  if (!config.smtp.host) missing.push('SMTP_HOST');
  if (!config.smtp.user) missing.push('SMTP_USER');
  if (!config.smtp.pass) missing.push('SMTP_PASS');
  return missing;
}

/**
 * Lazily creates and caches the Nodemailer transporter.
 * Returns null if SMTP credentials are not configured, so callers can decide
 * how to degrade — see mailService, which refuses to fake success in production.
 */
function getTransporter() {
  if (transporter) return transporter;
  if (!isConfigured()) return null;

  transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    // secure=true means TLS on connect (port 465). On 587 the connection starts
    // plaintext and upgrades via STARTTLS, which requireTLS makes mandatory
    // rather than optional — otherwise a server that omits STARTTLS would be
    // sent credentials in the clear.
    secure: config.smtp.secure,
    requireTLS: !config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.pass },
    // Without these a wedged SMTP connection hangs the request until the client
    // gives up, which reads to the visitor as an unexplained failure.
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  return transporter;
}

/**
 * Checks the SMTP credentials against the server. Safe to call at startup:
 * it never throws, it only reports, so a bad mail config cannot stop the API
 * from booting.
 */
async function verifyTransport() {
  const missing = missingSettings();
  if (missing.length) {
    console.warn(`[mailer] SMTP not configured — missing: ${missing.join(', ')}. Email sending is DISABLED.`);
    return { ok: false, reason: 'not_configured', missing };
  }

  try {
    await getTransporter().verify();
    console.log(`[mailer] SMTP ready — ${config.smtp.host}:${config.smtp.port} as ${config.smtp.user}, delivering to ${config.contactReceiver}`);
    return { ok: true };
  } catch (err) {
    console.error(`[mailer] SMTP verification FAILED (${err.code || 'unknown'}): ${err.message}`);
    if (err.code === 'EAUTH') {
      console.error('[mailer] Authentication was rejected. For Gmail this must be a 16-character App Password (2FA required), not the account password.');
    }
    return { ok: false, reason: err.code || 'verify_failed', message: err.message };
  }
}

module.exports = { getTransporter, verifyTransport, isConfigured, missingSettings };
