const express = require('express');
const router = express.Router();
const { getTrends, getTrendsByCategory, getTrendsForRole } = require('../controllers/trendController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getTrends);
router.get('/:role', protect, getTrendsForRole);
router.get('/category/:category', protect, getTrendsByCategory);

module.exports = router;
