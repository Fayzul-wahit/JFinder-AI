const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiMentorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/chat', protect, chat);

module.exports = router;
