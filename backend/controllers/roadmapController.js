const asyncHandler = require('express-async-handler');
const Roadmap = require('../models/Roadmap');
const UserProgress = require('../models/UserProgress');

exports.getRoadmapByJobRole = asyncHandler(async (req, res) => {
  const roadmap = await Roadmap.findOne({ jobRole: req.params.jobRole });
  if (roadmap) {
    res.status(200).json({ success: true, data: roadmap });
  } else {
    res.status(404);
    throw new Error('Roadmap not found');
  }
});

exports.updateLessonProgress = asyncHandler(async (req, res) => {
  // Mock updating lesson progress
  const { lessonId, xpReward } = req.body;
  res.status(200).json({ success: true, message: 'Lesson progress updated', data: { lessonId, xpReward } });
});
