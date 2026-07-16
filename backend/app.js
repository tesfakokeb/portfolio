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

const app = express();

// ---- Security & core middleware ----
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin header) and configured origins.
      if (!origin || config.clientOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
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

// ---- Test DB connection on startup ----
testConnection();

module.exports = app;

