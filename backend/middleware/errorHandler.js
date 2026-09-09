const config = require('../config/config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  // Deliberate ApiErrors carry messages written for the client. Unexpected 5xx
  // errors do not — echoing their raw message can leak stack/driver/SMTP detail,
  // so those get a generic message in production.
  const isDeliberate = Boolean(err.statusCode);
  const safeMessage =
    isDeliberate || config.nodeEnv === 'development'
      ? err.message || 'Internal server error'
      : 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message: safeMessage,
    details: err.details || undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
