const express = require('express');
const router = express.Router();
const { getRoadmapByJobRole, updateLessonProgress } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:jobRole', protect, getRoadmapByJobRole);
router.post('/progress', protect, updateLessonProgress);

module.exports = router;
