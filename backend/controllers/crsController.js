const { computeCRS } = require('../services/crsService');

exports.calculateCRS = async (req, res) => {
  try {
    const crsResult = computeCRS(req.user);
    return res.status(200).json({ success: true, data: crsResult });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
