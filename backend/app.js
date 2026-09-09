const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

const config = require('./config/config');
const apiRoutes = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { testConnection } = require('./database/db');
const { verifyTransport } = require('./config/mailer');

const app = express();

// ---- Security & core middleware ----
app.use(
  helmet({
    // Uploaded avatars / CV are served from this origin but embedded by the
    // frontend on a different origin. Default helmet blocks that with
    // Cross-Origin-Resource-Policy: same-origin.
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin header) and configured origins.
      if (!origin || config.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Reject without throwing: throwing here surfaces as an opaque 500 with
      // no CORS headers, which is very hard to diagnose from the browser.
      console.warn(
        `[cors] blocked origin: ${origin} — add it to CLIENT_ORIGINS. Allowed: ${config.clientOrigins.join(', ')}`
      );
      return callback(null, false);
    },
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));
app.use('/api', apiLimiter);

// ---- Serve uploaded files (CV, avatars) ----
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Routes ----
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Portfolio API is running. See /api for available endpoints.' });
});
app.use('/api', apiRoutes);

// ---- Error handling (must be last) ----
app.use(notFound);
app.use(errorHandler);

// ---- Startup self-checks ----
testConnection();
// Reports SMTP status in the logs instead of failing silently on first send.
verifyTransport();

module.exports = app;

