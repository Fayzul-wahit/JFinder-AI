const asyncHandler = require('express-async-handler');
const JobTrend = require('../models/JobTrend');

exports.getTrends = asyncHandler(async (req, res) => {
  const trends = await JobTrend.find({});
  res.status(200).json({ success: true, data: trends });
});

exports.getTrendsByCategory = asyncHandler(async (req, res) => {
  const trends = await JobTrend.find({ category: req.params.category });
  res.status(200).json({ success: true, data: trends });
});
