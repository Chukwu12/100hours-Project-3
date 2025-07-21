exports.getApiKey = (req, res) => {
  const apiKey = process.env.RECIPES_API_KEY;
  if (!apiKey || apiKey.length < 20) {
    return res.status(500).json({ error: 'API key not found or invalid' });
  }
  res.json({ apiKey });
};
