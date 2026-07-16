const config = require('../config/config');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  if (statusCode >= 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    details: err.details || undefined,
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
