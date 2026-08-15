const express = require('express');
const router = express.Router();
const { 
  getAllCompanies, 
  getCompanyById, 
  getRecommendations, 
  searchCompanies,
  getSalaryTrends 
} = require('../controllers/companyController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getAllCompanies);
router.get('/search', protect, searchCompanies);
router.get('/jobs/salary', protect, getSalaryTrends);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', protect, getCompanyById);

module.exports = router;
