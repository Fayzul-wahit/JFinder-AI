const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  skillId: String,
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  skillName: { type: String, required: true },
  category: { type: String, enum: ['Programming', 'Database', 'Analytics', 'AI', 'Cloud', 'Soft Skill'] },
  importance: { type: String, enum: ['High', 'Medium', 'Low'] },
  requiredLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'] }
});

module.exports = mongoose.model('Skill', skillSchema);
