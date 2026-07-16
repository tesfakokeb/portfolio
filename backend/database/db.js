const mysql = require('mysql2/promise');
const config = require('../config/config');

/**
 * MySQL connection pool.
 * Uses mysql2/promise for async/await support.
 * Reads credentials from config (environment variables).
 */
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Return dates as strings to avoid timezone issues
  dateStrings: true,
});

/**
 * Test the database connection.
 * Call this on server startup to fail fast if the DB is unreachable.
 */
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    // Don't crash the server — let it start so other endpoints still work
  }
}

module.exports = { pool, testConnection };
