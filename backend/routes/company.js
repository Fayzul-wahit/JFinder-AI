const express = require('express');
const router = express.Router();
const { getAllCompanies, getCompanyById, getRecommendations } = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllCompanies);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', getCompanyById);

module.exports = router;
