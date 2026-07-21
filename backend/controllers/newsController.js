const asyncHandler = require('express-async-handler');
const News = require('../models/News');

exports.getNews = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.trending === 'true') filter.isTrending = true;

  const news = await News.find(filter);
  res.status(200).json({ success: true, data: news });
});

exports.getNewsById = asyncHandler(async (req, res) => {
  const news = await News.findById(req.params.id);
  if (news) {
    res.status(200).json({ success: true, data: news });
  } else {
    res.status(404);
    throw new Error('News not found');
  }
});
