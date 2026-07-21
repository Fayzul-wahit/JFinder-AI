const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  roadmapId: String,
  jobRole: { type: String, required: true },
  levels: [{
    levelNumber: Number,
    levelName: String,
    lessons: [{
      lessonId: String,
      title: String,
      type: { type: String, enum: ['video', 'project', 'quiz', 'cert', 'article'] },
      resourceId: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningResource' },
      xpReward: Number,
      isUnlocked: { type: Boolean, default: false }
    }]
  }]
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
