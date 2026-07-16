const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const cvDir = path.join(__dirname, '..', 'uploads', 'cv');
const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');
const certDir = path.join(__dirname, '..', 'uploads', 'certificates');
fs.mkdirSync(cvDir, { recursive: true });
fs.mkdirSync(avatarDir, { recursive: true });
fs.mkdirSync(certDir, { recursive: true });

// --- CV Upload ---
const cvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, cvDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `cv_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const cvFilter = (req, file, cb) => {
  const allowed = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .pdf, .doc, and .docx files are allowed for CV.'), false);
  }
};

const uploadCV = multer({
  storage: cvStorage,
  fileFilter: cvFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single('cv');

// --- Profile Picture Upload ---
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `avatar_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const avatarFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, and .webp images are allowed.'), false);
  }
};

const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: avatarFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('avatar');

// --- Certificate Upload ---
const certStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, certDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `cert_${Date.now()}${ext}`;
    cb(null, name);
  },
});

const certFilter = (req, file, cb) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.pdf'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp, and .pdf files are allowed for certificates.'), false);
  }
};

const uploadCertificateFile = multer({
  storage: certStorage,
  fileFilter: certFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single('certificate');

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
};
