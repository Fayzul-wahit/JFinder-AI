const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.status(200).json({ success: true, data: user });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedUser });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

exports.uploadResume = asyncHandler(async (req, res) => {
  // Placeholder for file upload
  res.status(200).json({ success: true, data: { resumeUrl: 'mock_resume_url.pdf' } });
});

exports.deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});
