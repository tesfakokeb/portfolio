const { getTransporter } = require('../config/mailer');
const config = require('../config/config');

/**
 * Sends the contact form submission by email. If SMTP isn't configured
 * (e.g. local development without credentials), logs the message instead
 * of throwing, so the frontend still gets a successful response during dev.
 */
async function sendContactEmail({ name, email, subject, message }) {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Portfolio Contact Form" <${config.smtp.user}>`,
    to: config.contactReceiver,
    replyTo: email,
    subject: `[Portfolio] ${subject}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `
      <div style="font-family: sans-serif; line-height: 1.6;">
        <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      </div>
    `,
  };

  if (!transporter) {
    console.warn('[mailService] SMTP not configured — logging contact submission instead of sending email:');
    console.warn(mailOptions);
    return { simulated: true };
  }

  const info = await transporter.sendMail(mailOptions);
  return { simulated: false, messageId: info.messageId };
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sends a password reset email with a link containing the reset token.
 */
async function sendPasswordReset(toEmail, userName, resetUrl) {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Portfolio Dashboard" <${config.smtp.user}>`,
    to: toEmail,
    subject: 'Password Reset Request',
    text: `Hi ${userName},\n\nYou requested a password reset. Click the link below to set a new password:\n\n${resetUrl}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, you can safely ignore this email.`,
    html: `
      <div style="font-family: 'Inter', sans-serif; max-width: 520px; margin: 0 auto; padding: 32px; background: #0b1b2e; border-radius: 14px; color: #eef2f8;">
        <h2 style="margin: 0 0 16px; color: #4fd3c4; font-size: 1.3rem;">Password Reset</h2>
        <p style="margin: 0 0 12px; line-height: 1.6; color: #b7c2d4;">Hi ${escapeHtml(userName)},</p>
        <p style="margin: 0 0 24px; line-height: 1.6; color: #b7c2d4;">You requested a password reset for your portfolio dashboard. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #2e7dd1, #4fd3c4); color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">Reset Password</a>
        <p style="margin: 24px 0 0; font-size: 0.85rem; color: #7c8aa0;">This link expires in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  if (!transporter) {
    console.warn('[mailService] SMTP not configured — logging password reset instead of sending:');
    console.warn(mailOptions);
    return { simulated: true };
  }

  const info = await transporter.sendMail(mailOptions);
  return { simulated: false, messageId: info.messageId };
}

module.exports = { sendContactEmail, sendPasswordReset };

