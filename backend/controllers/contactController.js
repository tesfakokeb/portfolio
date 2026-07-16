const mailService = require('../services/mailService');
const asyncHandler = require('../utils/asyncHandler');

const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;
  const result = await mailService.sendContactEmail({ name, email, subject, message });
  res.status(200).json({
    success: true,
    message: 'Your message has been sent. Thank you for reaching out.',
    simulated: result.simulated ?? false,
  });
});

module.exports = { sendContactMessage };
