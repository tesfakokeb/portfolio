const { body, validationResult } = require('express-validator');
const ApiError = require('../utils/ApiError');

/** Runs after a chain of express-validator checks; converts failures into an ApiError. */
function handleValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new ApiError(400, 'Validation failed', errors.array()));
  }
  next();
}

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('A valid email is required').normalizeEmail(),
  body('subject').trim().notEmpty().withMessage('Subject is required').isLength({ max: 150 }),
  body('message').trim().isLength({ min: 10, max: 5000 }).withMessage('Message must be at least 10 characters'),
  handleValidation,
];

const validateComment = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 80 }),
  body('organization').optional({ checkFalsy: true }).trim().isLength({ max: 120 }),
  body('avatar').optional({ checkFalsy: true }).trim().isURL().withMessage('Avatar must be a valid URL'),
  body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment cannot be empty'),
  body('parentId').optional({ checkFalsy: true }).trim(),
  handleValidation,
];

module.exports = { validateContact, validateComment, handleValidation };
