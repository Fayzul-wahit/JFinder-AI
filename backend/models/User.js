const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  email: { type: String, sparse: true },
  password: { type: String },
  avatar: String,
  age: Number,
  college: String,
  department: String,
  degree: String,
  currentYear: Number,
  currentSemester: Number,
  cgpa: Number,
  skills: [String],
  projects: [{ title: String, description: String, techStack: [String], url: String }],
  certifications: [{ name: String, issuingOrg: String, date: Date, fileUrl: String }],
  resumeUrl: String,
  dreamJob: String,
  dreamCompany: String,
  preferredSalary: String,
  preferredLocation: String,
  careerInterests: [String],
  isProfileComplete: { type: Boolean, default: false },
  onboardingCompleted: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
