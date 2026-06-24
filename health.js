// api/health.js
// Simple health check — visit /api/health to confirm the server is running
module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    app: 'Ottawa Grocery Price Finder',
    version: '1.0.0',
    apiKeyConfigured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
};
