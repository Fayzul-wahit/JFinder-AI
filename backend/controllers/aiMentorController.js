const { askMentor } = require('../services/aiService');

const chat = async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const reply = askMentor(req.user || { id: userId }, message);
    return res.status(200).json({ success: true, data: reply });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { chat };
