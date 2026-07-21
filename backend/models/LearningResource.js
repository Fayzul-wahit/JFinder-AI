const mongoose = require('mongoose');

const learningResourceSchema = new mongoose.Schema({
  resourceId: String,
  jobRole: String,
  skillName: String,
  title: { type: String, required: true },
  platform: String,
  url: String,
  type: { type: String, enum: ['video', 'course', 'doc', 'github', 'article'] },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] },
  durationHours: Number
});

module.exports = mongoose.model('LearningResource', learningResourceSchema);
