const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
  },
  college: String,
  department: String,
  degree: String,
  currentYear: String,
  currentSemester: String,
  cgpa: Number,
  skills: [String],
  projects: [{ title: String, description: String }],
  certifications: [{
    name: String,
    organization: String,
    date: String,
    fileUrl: String
  }],
  resumeUrl: String,
  dreamJob: String,
  dreamCompany: String,
  preferredSalary: String,
  preferredLocation: String,
  careerInterests: [String],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
