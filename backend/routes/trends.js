const express = require('express');
const router = express.Router();
const { getTrends, getTrendsByCategory } = require('../controllers/trendController');

router.get('/', getTrends);
router.get('/:category', getTrendsByCategory);

module.exports = router;
