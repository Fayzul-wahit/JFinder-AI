const express = require('express');
const router = express.Router();
const { getRoadmapProgress, updateLessonProgress, getRoadmapByJobRole } = require('../controllers/roadmapController');
const { protect } = require('../middleware/authMiddleware');

router.get('/progress', protect, getRoadmapProgress);
router.post('/progress', protect, updateLessonProgress);
router.get('/:jobRole', protect, getRoadmapByJobRole);

module.exports = router;
