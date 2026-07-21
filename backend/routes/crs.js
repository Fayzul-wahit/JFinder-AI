const express = require('express');
const router = express.Router();
const { calculateCRS } = require('../controllers/crsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, calculateCRS);

module.exports = router;
