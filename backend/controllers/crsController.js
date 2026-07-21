const asyncHandler = require('express-async-handler');
const { computeCRS } = require('../services/crsService');

exports.calculateCRS = asyncHandler(async (req, res) => {
  const crsResult = computeCRS(req.user);
  res.status(200).json({ success: true, data: crsResult });
});
