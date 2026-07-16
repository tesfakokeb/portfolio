const path = require('path');
const fs = require('fs/promises');
const { pool } = require('../database/db');
const asyncHandler = require('../utils/asyncHandler');

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC — Get all certificates
// ═══════════════════════════════════════════════════════════════════════════════

const getCertificates = asyncHandler(async (req, res) => {
  const [rows] = await pool.execute(
    'SELECT * FROM certificates ORDER BY sort_order ASC, created_at DESC'
  );

  // Parse the skills JSON field for each row
  const certificates = rows.map((row) => ({
    ...row,
    skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills || [],
  }));

  res.status(200).json({ success: true, certificates });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Create a certificate (with optional image upload)
// ═══════════════════════════════════════════════════════════════════════════════

const createCertificate = asyncHandler(async (req, res) => {
  const { title, issuer, date, credential_id, credential_url, skills } = req.body;

  if (!title || !issuer) {
    return res.status(400).json({
      success: false,
      message: 'Title and issuer are required.',
    });
  }

  // Parse skills — accept JSON string or comma-separated
  let parsedSkills = [];
  if (skills) {
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
  }

  const imageUrl = req.file ? `/uploads/certificates/${req.file.filename}` : null;

  // Get next sort order
  const [maxRow] = await pool.execute(
    'SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM certificates'
  );
  const sortOrder = maxRow[0].next_order;

  const [result] = await pool.execute(
    `INSERT INTO certificates (title, issuer, date, credential_id, credential_url, skills, image_url, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, issuer, date || null, credential_id || null, credential_url || null, JSON.stringify(parsedSkills), imageUrl, sortOrder]
  );

  const [created] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [result.insertId]);

  const cert = created[0];
  cert.skills = typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills || [];

  res.status(201).json({
    success: true,
    message: 'Certificate created.',
    certificate: cert,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Update a certificate
// ═══════════════════════════════════════════════════════════════════════════════

const updateCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, issuer, date, credential_id, credential_url, skills } = req.body;

  // Check certificate exists
  const [existing] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  const fields = [];
  const values = [];

  if (title !== undefined) { fields.push('title = ?'); values.push(title); }
  if (issuer !== undefined) { fields.push('issuer = ?'); values.push(issuer); }
  if (date !== undefined) { fields.push('date = ?'); values.push(date); }
  if (credential_id !== undefined) { fields.push('credential_id = ?'); values.push(credential_id); }
  if (credential_url !== undefined) { fields.push('credential_url = ?'); values.push(credential_url); }

  if (skills !== undefined) {
    let parsedSkills = [];
    try {
      parsedSkills = JSON.parse(skills);
    } catch {
      parsedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    }
    fields.push('skills = ?');
    values.push(JSON.stringify(parsedSkills));
  }

  // Handle image upload — replace old file if new one provided
  if (req.file) {
    const newImageUrl = `/uploads/certificates/${req.file.filename}`;
    fields.push('image_url = ?');
    values.push(newImageUrl);

    // Delete old file if it exists
    if (existing[0].image_url) {
      const oldPath = path.join(__dirname, '..', existing[0].image_url);
      try { await fs.unlink(oldPath); } catch { /* file may not exist */ }
    }
  }

  if (fields.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'At least one field to update is required.',
    });
  }

  values.push(id);
  await pool.execute(`UPDATE certificates SET ${fields.join(', ')} WHERE id = ?`, values);

  const [updated] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [id]);
  const cert = updated[0];
  cert.skills = typeof cert.skills === 'string' ? JSON.parse(cert.skills) : cert.skills || [];

  res.status(200).json({
    success: true,
    message: 'Certificate updated.',
    certificate: cert,
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Delete a certificate
// ═══════════════════════════════════════════════════════════════════════════════

const deleteCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [existing] = await pool.execute('SELECT * FROM certificates WHERE id = ?', [id]);
  if (existing.length === 0) {
    return res.status(404).json({ success: false, message: 'Certificate not found.' });
  }

  // Delete uploaded file
  if (existing[0].image_url) {
    const filePath = path.join(__dirname, '..', existing[0].image_url);
    try { await fs.unlink(filePath); } catch { /* file may not exist */ }
  }

  await pool.execute('DELETE FROM certificates WHERE id = ?', [id]);

  res.status(200).json({
    success: true,
    message: 'Certificate deleted.',
  });
});

// ═══════════════════════════════════════════════════════════════════════════════
// DASHBOARD — Reorder certificates
// ═══════════════════════════════════════════════════════════════════════════════

const reorderCertificates = asyncHandler(async (req, res) => {
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
        'UPDATE certificates SET sort_order = ? WHERE id = ?',
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
    'SELECT * FROM certificates ORDER BY sort_order ASC'
  );

  const certificates = rows.map((row) => ({
    ...row,
    skills: typeof row.skills === 'string' ? JSON.parse(row.skills) : row.skills || [],
  }));

  res.status(200).json({
    success: true,
    message: 'Certificate order updated.',
    certificates,
  });
});

module.exports = {
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
};
