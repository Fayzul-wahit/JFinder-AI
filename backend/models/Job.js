const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: String,
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyName: String,
  jobRole: { type: String, required: true },
  department: String,
  experienceRequired: String,
  minimumCGPA: Number,
  competitiveCGPA: Number,
  salaryRange: String,
  workMode: { type: String, enum: ['Remote', 'Hybrid', 'Office'] },
  hiringDifficulty: { type: String, enum: ['Easy', 'Moderate', 'Hard', 'Very Hard'] },
  jobDescription: String
});

module.exports = mongoose.model('Job', jobSchema);
