const app = require('./app');
const config = require('./config/config');

const server = app.listen(config.port, () => {
  console.log(`🚀 Portfolio API listening on port ${config.port} [${config.nodeEnv}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
