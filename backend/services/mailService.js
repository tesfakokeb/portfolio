const { getTransporter, missingSettings } = require('../config/mailer');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');

const isProduction = config.nodeEnv === 'production';

/** Escapes the five characters that matter in HTML attribute and text context. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Strips CR/LF from anything interpolated into a mail header. Without this a
 * newline in the subject could inject extra headers (Bcc, Content-Type) into
 * the outgoing message.
 */
function headerSafe(str) {
  return String(str).replace(/[\r\n]+/g, ' ').trim();
}

/**
 * Wraps a send so that missing configuration and transport failures are
 * explicit. Previously a missing SMTP config returned a fake success, so the
 * visitor saw "Message sent" and the mail was silently dropped.
 */
async function deliver(mailOptions, { label }) {
  const transporter = getTransporter();

  if (!transporter) {
    const missing = missingSettings().join(', ');
    if (isProduction) {
      console.error(`[mailService] ${label}: cannot send — SMTP not configured (missing: ${missing}).`);
      throw new ApiError(500, 'Email delivery is not configured on the server.', { missing });
    }
    console.warn(`[mailService] ${label}: SMTP not configured (missing: ${missing}) — logging instead of sending. This would be an error in production.`);
    console.warn({ to: mailOptions.to, subject: mailOptions.subject, text: mailOptions.text });
    return { simulated: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[mailService] ${label}: sent to ${mailOptions.to} (id ${info.messageId}, response ${info.response || 'n/a'})`);
    return { simulated: false, messageId: info.messageId };
  } catch (err) {
    // Log the full cause server-side; return something safe and useful to the
    // client. Never surface credentials or raw SMTP dialogue to the browser.
    console.error(`[mailService] ${label}: send FAILED (${err.code || 'unknown'} / ${err.responseCode || 'n/a'}): ${err.message}`);
    if (err.code === 'EAUTH') {
      console.error('[mailService] SMTP rejected the credentials. For Gmail use a 16-character App Password with 2FA enabled.');
    }
    throw new ApiError(502, 'The message could not be delivered by the mail server. Please try again shortly.', {
      code: err.code || 'SEND_FAILED',
    });
  }
}

/** Sends the contact form submission by email. */
async function sendContactEmail({ name, email, subject, message }) {
  const safeName = headerSafe(name);
  const safeEmail = headerSafe(email);
  const safeSubject = headerSafe(subject);

  return deliver(
    {
      // Gmail and most providers require From to be the authenticated mailbox;
      // the visitor's address goes in Reply-To so replying reaches them.
      from: `"Portfolio Contact Form" <${config.smtp.user}>`,
      to: config.contactReceiver,
      replyTo: `"${safeName}" <${safeEmail}>`,
      subject: `[Portfolio] ${safeSubject}`,
      text: `From: ${safeName} <${safeEmail}>\n\n${message}`,
      html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>From:</strong> ${escapeHtml(safeName)} (${escapeHtml(safeEmail)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      </div>
    `,
    },
    { label: 'contact' }
  );
}

/** Sends a password reset email with a link containing the reset token. */
async function sendPasswordReset(toEmail, userName, resetUrl) {
  const safeName = headerSafe(userName);

  return deliver(
    {
      from: `"Portfolio Dashboard" <${config.smtp.user}>`,
      to: headerSafe(toEmail),
      subject: 'Password Reset Request',
      text: `Hi ${safeName},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
      html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0b1b2e; border-radius: 14px; color: #eef2f8;">
        <h2 style="margin: 0 0 16px; color: #4fd3c4; font-size: 1.3rem;">Password Reset</h2>
        <p style="margin: 0 0 12px; line-height: 1.6; color: #b7c2d4;">Hi ${escapeHtml(safeName)},</p>
        <p style="margin: 0 0 24px; line-height: 1.6; color: #b7c2d4;">You requested a password reset for your portfolio dashboard. Click the button below to set a new password:</p>
        <a href="${escapeHtml(resetUrl)}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #2e7dd1, #4fd3c4); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="margin: 24px 0 0; font-size: 0.85rem; color: #7c8aa0;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
    },
    { label: 'password-reset' }
  );
}

module.exports = { sendContactEmail, sendPasswordReset };
