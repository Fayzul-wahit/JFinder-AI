const express = require('express');
const router = express.Router();
const { googleAuth, googleCallback, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const passport = require('passport');

router.get('/google', googleAuth);
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), googleCallback);
router.post('/logout', logout);
router.get('/me', protect, getMe);

module.exports = router;
