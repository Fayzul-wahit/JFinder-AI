exports.askMentor = (userProfile, message) => {
  // Mock response for prototype
  // Real integration:
  // const openai = require('openai');
  // const client = new openai.OpenAI({ apiKey: process.env.AI_API_KEY });
  // const response = await client.chat.completions.create({ ... });
  
  return {
    reply: `This is a mock response to: "${message}". In production, this will be powered by OpenAI/Claude.`
  };
};
