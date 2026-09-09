const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// ─── Detect whether Cloudinary is configured ───────────────────────────────────
const useCloud = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// ═══════════════════════════════════════════════════════════════════════════════
// CLOUDINARY STORAGE (production)
// ═══════════════════════════════════════════════════════════════════════════════

const cloudCVStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/cv',
    resource_type: 'raw', // PDFs, DOCX etc.
    allowed_formats: ['pdf', 'doc', 'docx'],
    public_id: (req, file) => `cv_${Date.now()}`,
  },
});

const cloudAvatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'portfolio/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
    public_id: (req, file) => `avatar_${Date.now()}`,
  },
});

const cloudCertStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isPDF = ext === '.pdf';
    return {
      folder: 'portfolio/certificates',
      resource_type: isPDF ? 'raw' : 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'pdf'],
      public_id: `cert_${Date.now()}`,
    };
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// LOCAL DISK STORAGE (development fallback)
// ═══════════════════════════════════════════════════════════════════════════════

const cvDir = path.join(__dirname, '..', 'uploads', 'cv');
const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');
const certDir = path.join(__dirname, '..', 'uploads', 'certificates');
fs.mkdirSync(cvDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(certDir, { recursive: true });

const localCVStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, cvDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `cv_${Date.now()}${ext}`);
  },
});

const localAvatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `avatar_${Date.now()}${ext}`);
  },
});

const localCertStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, certDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `cert_${Date.now()}${ext}`);
  },
});

// ═══════════════════════════════════════════════════════════════════════════════
// FILE FILTERS
// ═══════════════════════════════════════════════════════════════════════════════

const cvFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed for CV.'), false);
  }
};

const avatarFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .webp images are allowed.'), false);
  }
};

const certFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp, and .pdf files are allowed for certificates.'), false);
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// MULTER INSTANCES — pick cloud vs local based on config
// ═══════════════════════════════════════════════════════════════════════════════

const uploadCV = multer({
  storage: useCloud ? cloudCVStorage : localCVStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('cv');

const uploadAvatar = multer({
  storage: useCloud ? cloudAvatarStorage : localAvatarStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('avatar');

const uploadCertificateFile = multer({
  storage: useCloud ? cloudCertStorage : localCertStorage,
  fileFilter: certFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('certificate');

// ═══════════════════════════════════════════════════════════════════════════════
// ERROR WRAPPER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Wrapper that turns multer errors into proper JSON responses
 * instead of crashing the request.
 */
function handleMulterError(uploadFn) {
  return (req, res, next) => {
    uploadFn(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, message: 'File too large.' });
        }
        return res.status(400).json({ success: false, message: err.message });
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
}

module.exports = {
  uploadCV: handleMulterError(uploadCV),
  uploadAvatar: handleMulterError(uploadAvatar),
  uploadCertificate: handleMulterError(uploadCertificateFile),
  useCloud,
};
