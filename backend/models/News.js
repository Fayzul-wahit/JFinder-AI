const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  newsId: String,
  title: { type: String, required: true },
  summary: String,
  category: { type: String, enum: ['Hiring', 'Technology', 'Economy', 'AI', 'General'] },
  tag: String,
  imageUrl: String,
  publishedAt: { type: Date, default: Date.now },
  readTime: Number,
  isTrending: { type: Boolean, default: false },
  relatedJob: String,
  relatedCompany: String
});

module.exports = mongoose.model('News', newsSchema);
