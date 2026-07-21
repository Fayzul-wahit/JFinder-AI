const asyncHandler = require('express-async-handler');
const { askMentor } = require('../services/aiService');

exports.chat = asyncHandler(async (req, res) => {
  const { message } = req.body;
  const reply = askMentor(req.user, message);
  res.status(200).json({ success: true, data: reply });
});
