// api/search.js
// ─────────────────────────────────────────────────────────────────
// This runs on Vercel's servers — your API key is NEVER sent to
// the browser. The browser calls /api/search?product=milk&stores=...
// and this file calls Anthropic securely on the server side.
// ─────────────────────────────────────────────────────────────────

const Anthropic = require('@anthropic-ai/sdk');

// Allow requests from your own domain (CORS fix)
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { product, city = 'Ottawa' } = req.query;

  if (!product || product.trim().length < 1) {
    return res.status(400).json({ error: 'Missing product parameter' });
  }

  // API key lives only on the server — set in Vercel environment variables
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured on server' });
  }

  const client = new Anthropic({ apiKey });

  const prompt = `Search for the current retail price of "${product}" at every type of food and grocery store in ${city}, Ontario, Canada.

Cover ALL these store categories:
1. BIG BOX: Walmart, Costco, Real Canadian Superstore, Loblaws, Metro, Farm Boy
2. DISCOUNT: No Frills, Food Basics, FreshCo, Giant Tiger, FoodFare  
3. ETHNIC & SPECIALTY: T&T Supermarket, Adonis, Silk Road Foods, Produce Depot, Herb and Spice, South Asian grocers, African grocery stores
4. HEALTH & ORGANIC: Whole Foods Market, Natural Food Pantry, Rainbow Foods, Bulk Barn, Ottawa Food Co-op
5. CONVENIENCE: Mac's/Circle K, Couche-Tard, 7-Eleven
6. PHARMACY: Shoppers Drug Mart, Rexall
7. DOLLAR & VARIETY: Dollarama, Giant Tiger
8. LOCAL & INDEPENDENT: Your Independent Grocer locations (Massine's, Davy's, Laura's, Riley's, Brierley's)

Rules:
- Skip stores that do NOT carry this product
- Use store-brand/private-label price where available (Kirkland, No Name, President's Choice, Great Value)
- If product comes in multiple sizes, pick the most common and note the size
- Use realistic 2025-2026 Ottawa CAD prices

For each store that carries the product, return a JSON object with:
- name: store name (include neighbourhood if multiple locations, e.g. "Walmart — Barrhaven")
- category: one of "Big box", "Discount", "Ethnic & specialty", "Health & organic", "Convenience", "Pharmacy", "Dollar & variety", "Local & independent"  
- address: one specific Ottawa street address
- price: number in CAD
- brand: brand name of the product found (e.g. "Kirkland", "No Name", "Natrel")
- size: package size (e.g. "4L", "1kg", "400g")
- inStock: true (assume true unless you find evidence otherwise)
- note: very short optional note (max 30 chars)

Respond ONLY with a raw JSON array. No markdown. No explanation. No code fences. No preamble.
Example: [{"name":"Walmart — South Keys","category":"Big box","address":"2210 Bank St","price":5.98,"brand":"Great Value","size":"4L","inStock":true,"note":""}]

Include 12–25 stores. Use realistic price variation between store types.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3000,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      messages: [{ role: 'user', content: prompt }]
    });

    // Extract text from response (may include tool use blocks)
    const text = message.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('\n');

    // Robust JSON extraction
    const cleaned = text.replace(/```json|```/g, '').trim();
    let start = -1, end = -1, depth = 0;
    for (let i = 0; i < cleaned.length; i++) {
      if (cleaned[i] === '[') { if (depth === 0) start = i; depth++; }
      else if (cleaned[i] === ']') { depth--; if (depth === 0) { end = i; break; } }
    }

    if (start === -1 || end === -1) {
      return res.status(502).json({ error: 'Could not parse store prices from AI response', raw: text.slice(0, 500) });
    }

    let jsonStr = cleaned.substring(start, end + 1);
    // Sanitize control characters
    jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F]/g, c => {
      if (c === '\n') return '\\n';
      if (c === '\r') return '\\r';
      if (c === '\t') return '\\t';
      return '';
    });

    const stores = JSON.parse(jsonStr);

    if (!Array.isArray(stores) || stores.length === 0) {
      return res.status(502).json({ error: 'No stores returned for this product' });
    }

    // Validate and sanitize each store
    const valid = stores.filter(s => s && typeof s.name === 'string' && typeof s.price === 'number' && s.price > 0);

    return res.status(200).json({
      product,
      city,
      fetchedAt: new Date().toISOString(),
      count: valid.length,
      stores: valid
    });

  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
};
