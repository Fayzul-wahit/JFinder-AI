const express = require('express');
const router = express.Router();
const { getAllJobs, getJobById, getJobsByRole } = require('../controllers/jobController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getAllJobs);
router.get('/:id', protect, getJobById);
router.get('/role/:role', protect, getJobsByRole);

module.exports = router;
