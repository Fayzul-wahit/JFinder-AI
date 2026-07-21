const mongoose = require('mongoose');

const jobTrendSchema = new mongoose.Schema({
  trendId: String,
  skillName: { type: String, required: true },
  category: String,
  demandLevel: { type: String, enum: ['High', 'Medium', 'Low', 'Growing', 'Declining'] },
  growthRate: Number,
  aiImpact: { type: String, enum: ['High', 'Medium', 'Low'] },
  salaryTrend: { type: String, enum: ['Rising', 'Stable', 'Declining'] },
  futureOutlook: String,
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('JobTrend', jobTrendSchema);
