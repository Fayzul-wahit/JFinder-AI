const News = require('../models/News');

exports.getNews = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.trending === 'true') filter.isTrending = true;

    const news = await News.find(filter);
    return res.status(200).json({ success: true, data: news });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (news) {
      return res.status(200).json({ success: true, data: news });
    } else {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
