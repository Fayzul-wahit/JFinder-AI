const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, uploadResume, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/profile')
  .get(protect, getProfile)
  .put(protect, updateProfile)
  .post(protect, updateProfile);
router.post('/resume', protect, uploadResume);
router.delete('/', protect, deleteAccount);

module.exports = router;
