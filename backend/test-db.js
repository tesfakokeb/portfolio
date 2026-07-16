require('dotenv').config();
const mysql = require('mysql2/promise');

async function test() {
  console.log('Attempting to connect to:');
  console.log('Host:', process.env.DB_HOST);
  console.log('Port:', process.env.DB_PORT);
  console.log('User:', process.env.DB_USER);
  console.log('Database:', process.env.DB_NAME);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000 // 10 seconds timeout
    });

    console.log('✅ Connection successful!');
    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err.message);
    if (err.code === 'ETIMEDOUT') {
      console.error('\nThis usually means the database server is blocking external connections.');
      console.error('If this is a shared host (like Hostinger/cPanel), you need to add your current IP address to the "Remote MySQL" whitelist in your hosting dashboard.');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('\nThis means the password is wrong OR the user does not have access from this IP.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(`\nThe database "${process.env.DB_NAME}" does not exist. (Did you mean u242310798_portfolio_db?)`);
    }
  }
}

test();
