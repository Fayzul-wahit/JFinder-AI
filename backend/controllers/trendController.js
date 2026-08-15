const JobTrend = require('../models/JobTrend');
const Job = require('../models/Job');

const getTrends = async (req, res) => {
  try {
    const { category, role } = req.query;
    let query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    // Note: If role filtering is needed, it would typically be a different model or field
    const trends = await JobTrend.find(query);
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrendsByCategory = async (req, res) => {
  try {
    const trends = await JobTrend.find({ category: req.params.category });
    res.status(200).json({ success: true, data: trends });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getTrendsForRole = async (req, res) => {
  try {
    // In a real scenario, this would query a RoleTrends collection.
    // For now, we mock the personalized outlook based on the role provided.
    const role = req.params.role || 'Software Engineer';
    const outlook = {
      role,
      demandLevel: 'High',
      growthPrediction: '+18% YoY',
      recommendedSkills: ['Cloud Architecture', 'System Design', 'AI Engineering'],
      futureReadiness: 'Strong',
      aiImpact: 'Medium',
      automatingTasks: ['Boilerplate Code Generation', 'Basic Testing', 'Log Analysis'],
      growingSkills: ['AI Prompting', 'Architecture Design', 'Complex Problem Solving'],
      futureOutlookText: `AI is accelerating development for ${role}s, making higher-level architectural thinking and AI-tool proficiency more critical than ever.`
    };
    res.status(200).json({ success: true, data: outlook });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getTrends,
  getTrendsByCategory,
  getTrendsForRole
};
