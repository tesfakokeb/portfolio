const path = require('path');
const fs = require('fs/promises');
const { pool } = require('../database/db');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const { useCloud } = require('../middleware/uploadMiddleware');

// ═══════════════════════════════════════════════════════════════════════════════
// NAVBAR MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const getNavItems = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM navbar_items ORDER BY sort_order ASC'
  );
  res.status(200).json({ success: true, navItems: rows });
});

const createNavItem = asyncHandler(async (req, res) => {
  const { label, href } = req.body;

  if (!label || !href) {
    return res.status(400).json({
      success: false,
      message: 'Label and href are required.',
    });
  }

  // Get next sort order
  const [maxRow] = await pool.execute(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM navbar_items'
  );
  const sortOrder = maxRow[0].next_order;

  const [result] = await pool.execute(
    'INSERT INTO navbar_items (label, href, sort_order) VALUES (?, ?, ?)',
    [label, href, sortOrder]
  );

  res.status(201).json({
    success: true,
    message: 'Navbar item created.',
    navItem: { id: result.insertId, label, href, sort_order: sortOrder, is_visible: 1 },
  });
});

const updateNavItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { label, href, is_visible } = req.body;

  const fields = [];
  const values = [];

  if (label !== undefined) { fields.push('label = ?'); values.push(label); }
  if (href !== undefined) { fields.push('href = ?'); values.push(href); }
  if (is_visible !== undefined) { fields.push('is_visible = ?'); values.push(is_visible ? 1 : 0); }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one field to update is required.',
    });
  }

  values.push(id);
  await pool.execute(
    `UPDATE navbar_items SET ${fields.join(', ')} WHERE id = ?`,
    values
  );

  const [updated] = await pool.execute('SELECT * FROM navbar_items WHERE id = ?', [id]);

  res.status(200).json({
    success: true,
    message: 'Navbar item updated.',
    navItem: updated[0] || null,
  });
});

const deleteNavItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [result] = await pool.execute('DELETE FROM navbar_items WHERE id = ?', [id]);

  if (result.affectedRows === 0) {
    return res.status(404).json({
      success: false,
      message: 'Navbar item not found.',
    });
  }

  res.status(200).json({
    success: true,
    message: 'Navbar item deleted.',
  });
});

const reorderNavItems = asyncHandler(async (req, res) => {
  const { order } = req.body; // Array of { id, sort_order }

  if (!Array.isArray(order)) {
    return res.status(400).json({
      success: false,
      message: 'Order must be an array of { id, sort_order }.',
    });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (const item of order) {
      await connection.execute(
        'UPDATE navbar_items SET sort_order = ? WHERE id = ?',
        [item.sort_order, item.id]
      );
    }
    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  const [rows] = await pool.execute(
    'SELECT * FROM navbar_items ORDER BY sort_order ASC'
  );

  res.status(200).json({
    success: true,
    message: 'Navbar order updated.',
    navItems: rows,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

const getProfile = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute('SELECT * FROM profile LIMIT 1');

  if (rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No profile found. Please seed the database.',
    });
  }

  res.status(200).json({ success: true, profile: rows[0] });
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = [
    'full_name', 'credentials', 'role_title', 'organization',
    'summary', 'bio', 'email', 'phone', 'location',
    'github_url', 'linkedin_url', 'scholar_url', 'facebook_url', 'twitter_url',
  ];

  const fields = [];
  const values = [];

  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one field to update is required.',
    });
  }

  // Update the first (and only) profile row
  await pool.execute(
    `UPDATE profile SET ${fields.join(', ')} WHERE id = (SELECT min_id FROM (SELECT MIN(id) AS min_id FROM profile) AS tmp)`,
    values
  );

  const [updated] = await pool.execute('SELECT * FROM profile LIMIT 1');

  res.status(200).json({
    success: true,
    message: 'Profile updated.',
    profile: updated[0],
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// FILE UPLOADS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Helper: extract the Cloudinary public_id from a URL so we can delete it later.
 * e.g. "https://res.cloudinary.com/.../portfolio/avatars/avatar_123.jpg"
 *   → "portfolio/avatars/avatar_123"
 */
function extractPublicId(url) {
  if (!url || !url.includes('cloudinary')) return null;
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return null;
    // After /upload/ there may be a version (v12345/) then the public_id.ext
    let tail = parts[1];
    // Remove optional version prefix
    tail = tail.replace(/^v\d+\//, '');
    // Remove file extension
    return tail.replace(/\.[^/.]+$/, '');
  } catch {
    return null;
  }
}

const uploadCV = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No CV file uploaded.',
    });
  }

  // Cloudinary: req.file.path is the full URL
  // Local disk: build the path manually
  const cvUrl = useCloud ? req.file.path : `/uploads/cv/${req.file.filename}`;

  // Update profile with new CV URL
  await pool.execute(
    'UPDATE profile SET cv_url = ? WHERE id = (SELECT min_id FROM (SELECT MIN(id) AS min_id FROM profile) AS tmp)',
    [cvUrl]
  );

  res.status(200).json({
    success: true,
    message: 'CV uploaded successfully.',
    cvUrl,
  });
});

const uploadProfilePicture = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No image file uploaded.',
    });
  }

  let pictureUrl;

  if (useCloud) {
    // Cloudinary already resized via transformation params — URL is in req.file.path
    pictureUrl = req.file.path;
  } else {
    // Local development: resize with sharp if available
    let finalFilename = req.file.filename;
    try {
      const sharp = require('sharp');
      const inputPath = req.file.path;
      const ext = path.extname(inputPath);
      const resizedName = `resized_${Date.now()}${ext}`;
      const outputPath = path.join(path.dirname(inputPath), resizedName);

      await sharp(inputPath)
        .resize(500, 500, { fit: 'cover', position: 'centre' })
        .toFile(outputPath);

      // Remove original, use resized
      await fs.unlink(inputPath);
      finalFilename = resizedName;
    } catch (sharpErr) {
      // sharp not installed or failed — use original file as-is
      console.warn('[uploadProfilePicture] sharp resize skipped:', sharpErr.message);
    }
    pictureUrl = `/uploads/avatars/${finalFilename}`;
  }

  // Delete previous Cloudinary asset if replacing
  if (useCloud) {
    const [rows] = await pool.execute('SELECT profile_picture_url FROM profile LIMIT 1');
    if (rows.length > 0 && rows[0].profile_picture_url) {
      const oldId = extractPublicId(rows[0].profile_picture_url);
      if (oldId) {
        try { await cloudinary.uploader.destroy(oldId); } catch { /* ignore */ }
      }
    }
  }

  // Update profile
  await pool.execute(
    'UPDATE profile SET profile_picture_url = ? WHERE id = (SELECT min_id FROM (SELECT MIN(id) AS min_id FROM profile) AS tmp)',
    [pictureUrl]
  );

  res.status(200).json({
    success: true,
    message: 'Profile picture uploaded successfully.',
    profilePictureUrl: pictureUrl,
  });
});

module.exports = {
  getNavItems,
  createNavItem,
  updateNavItem,
  deleteNavItem,
  reorderNavItems,
  getProfile,
  updateProfile,
  uploadCV,
  uploadProfilePicture,
};
