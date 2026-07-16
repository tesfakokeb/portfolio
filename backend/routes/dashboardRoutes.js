const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { uploadCV, uploadAvatar, uploadCertificate } = require('../middleware/uploadMiddleware');
const {
  getNavItems,
  createNavItem,
  updateNavItem,
  deleteNavItem,
  reorderNavItems,
  getProfile,
  updateProfile,
  uploadCV: uploadCVHandler,
  uploadProfilePicture,
} = require('../controllers/dashboardController');
const {
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
} = require('../controllers/certificatesController');

const router = express.Router();

// All dashboard routes are protected
router.use(protect);

// ─── Navbar ────────────────────────────────────────────────────────────────────
router.get('/navbar', getNavItems);
router.post('/navbar', createNavItem);
router.put('/navbar/reorder', reorderNavItems);
router.put('/navbar/:id', updateNavItem);
router.delete('/navbar/:id', deleteNavItem);

// ─── Profile ───────────────────────────────────────────────────────────────────
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// ─── File Uploads ──────────────────────────────────────────────────────────────
router.post('/upload/cv', uploadCV, uploadCVHandler);
router.post('/upload/profile-picture', uploadAvatar, uploadProfilePicture);

// ─── Certificates ──────────────────────────────────────────────────────────────
router.post('/certificates', uploadCertificate, createCertificate);
router.put('/certificates/reorder', reorderCertificates);
router.put('/certificates/:id', uploadCertificate, updateCertificate);
router.delete('/certificates/:id', deleteCertificate);

module.exports = router;
