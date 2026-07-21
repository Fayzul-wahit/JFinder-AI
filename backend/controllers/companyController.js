const asyncHandler = require('express-async-handler');
const Company = require('../models/Company');
const Job = require('../models/Job');

exports.getAllCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.find({});
  res.status(200).json({ success: true, data: companies });
});

exports.getCompanyById = asyncHandler(async (req, res) => {
  const company = await Company.findById(req.params.id);
  if (company) {
    const jobs = await Job.find({ companyId: company._id });
    res.status(200).json({ success: true, data: { company, jobs } });
  } else {
    res.status(404);
    throw new Error('Company not found');
  }
});

exports.getRecommendations = asyncHandler(async (req, res) => {
  const companies = await Company.find({}).limit(5); // Mock recommendation
  res.status(200).json({ success: true, data: companies });
});
