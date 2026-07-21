const asyncHandler = require('express-async-handler');
const { analyzeSkillGap } = require('../services/skillGapService');

exports.getSkillGap = asyncHandler(async (req, res) => {
  // Mock required skills for dream job
  const requiredSkills = ['Python', 'SQL', 'Machine Learning'];
  const gapAnalysis = analyzeSkillGap(req.user.skills || [], requiredSkills);
  res.status(200).json({ success: true, data: gapAnalysis });
});
