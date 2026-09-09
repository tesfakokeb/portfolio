require("dotenv").config();

function parseOrigins(str) {
  const defaults = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    // Deployed frontends. Kept in code (not only in CLIENT_ORIGINS) so that a
    // missing or mistyped env var on the host can never break the live site.
    "https://portfolio-v6z9.onrender.com",
    "https://tesfaworku.com",
    "https://www.tesfaworku.com",
  ];

  if (!str) return defaults;

  const parsed = str
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...defaults, ...parsed])];
}

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  clientOrigins: parseOrigins(process.env.CLIENT_ORIGINS),

  // Public URL of the deployed frontend, used to build links inside emails
  // (e.g. password reset). clientOrigins[0] is always a localhost default, so
  // relying on it sent every reset link to http://localhost:5173.
  clientUrl:
    process.env.CLIENT_URL ||
    parseOrigins(process.env.CLIENT_ORIGINS).find(
      (o) => !o.includes("localhost") && !o.includes("127.0.0.1")
    ) ||
    "http://localhost:5173",

  // MySQL database
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "portfolio_db",
  },

  // JWT authentication
  jwtSecret: process.env.JWT_SECRET || "change-this-to-a-random-secret-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  contactReceiver: process.env.CONTACT_RECEIVER || process.env.SMTP_USER,

  rateLimit: {
    windowMinutes: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) || 15,
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },
};
