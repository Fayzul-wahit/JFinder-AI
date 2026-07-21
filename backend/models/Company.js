const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  companyId: String,
  companyName: { type: String, required: true },
  industry: String,
  headquarters: String,
  companyWebsite: String,
  companySize: String,
  foundedYear: Number,
  hiringStatus: { type: String, enum: ['Active', 'Moderate', 'Low', 'Closed'], default: 'Active' },
  companyDescription: String,
  logo: String
});

module.exports = mongoose.model('Company', companySchema);
