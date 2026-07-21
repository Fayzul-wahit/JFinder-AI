const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roadmapId: { type: mongoose.Schema.Types.ObjectId, ref: 'Roadmap' },
  currentLevel: { type: Number, default: 1 },
  completedLessons: [String],
  xp: { type: Number, default: 0 },
  badges: [{ name: String, tier: String, awardedAt: Date }],
  streakDays: { type: Number, default: 0 },
  lastActiveAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserProgress', userProgressSchema);
