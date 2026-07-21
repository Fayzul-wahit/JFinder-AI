const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

exports.googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });

exports.googleCallback = (req, res) => {
  const token = generateToken(req.user._id);
  const redirectPath = req.user.isProfileComplete ? 'dashboard' : 'onboarding';
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  res.redirect(`${clientUrl}/${redirectPath}?token=${token}`);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  });
};

exports.getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
