-- ============================================================================
-- Portfolio Management Dashboard — MySQL Schema
-- Run this file against your MySQL database to create all required tables.
--
--   mysql -u root -p portfolio_db < schema.sql
-- ============================================================================

-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS portfolio_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE portfolio_db;

-- ----------------------------------------------------------------------------
-- 1. Users — authentication and access control
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  role          ENUM('admin', 'editor') DEFAULT 'admin',
  reset_token   VARCHAR(255) DEFAULT NULL,
  reset_token_expires DATETIME DEFAULT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_email (email),
  INDEX idx_users_reset_token (reset_token)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 2. Profile — single-row table for the portfolio owner's information
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  full_name           VARCHAR(255) NOT NULL,
  credentials         VARCHAR(100)  DEFAULT NULL,
  role_title          VARCHAR(255)  DEFAULT NULL,
  organization        VARCHAR(255)  DEFAULT NULL,
  summary             TEXT          DEFAULT NULL,
  bio                 TEXT          DEFAULT NULL,
  email               VARCHAR(255)  DEFAULT NULL,
  phone               VARCHAR(50)   DEFAULT NULL,
  location            VARCHAR(255)  DEFAULT NULL,
  profile_picture_url VARCHAR(500)  DEFAULT NULL,
  cv_url              VARCHAR(500)  DEFAULT NULL,
  github_url          VARCHAR(500)  DEFAULT NULL,
  linkedin_url        VARCHAR(500)  DEFAULT NULL,
  scholar_url         VARCHAR(500)  DEFAULT NULL,
  facebook_url        VARCHAR(500)  DEFAULT NULL,
  twitter_url         VARCHAR(500)  DEFAULT NULL,
  updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 3. Navbar Items — dynamically managed from the dashboard
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS navbar_items (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  label       VARCHAR(100) NOT NULL,
  href        VARCHAR(255) NOT NULL,
  sort_order  INT DEFAULT 0,
  is_visible  BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_navbar_sort (sort_order)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 4. Sessions — JWT blacklist for logout / token invalidation
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  token_hash  VARCHAR(255) NOT NULL,
  expires_at  DATETIME NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_token (token_hash),
  INDEX idx_sessions_expires (expires_at)
) ENGINE=InnoDB;

-- ----------------------------------------------------------------------------
-- 5. Certificates — professional certifications managed from the dashboard
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS certificates (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(255) NOT NULL,
  issuer         VARCHAR(255) NOT NULL,
  date           VARCHAR(50)  DEFAULT NULL,
  credential_id  VARCHAR(255) DEFAULT NULL,
  credential_url VARCHAR(500) DEFAULT NULL,
  skills         JSON         DEFAULT NULL,
  image_url      VARCHAR(500) DEFAULT NULL,
  sort_order     INT          DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_certificates_sort (sort_order)
) ENGINE=InnoDB;
