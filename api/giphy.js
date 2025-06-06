export default async function handler(req, res) {
  const { endpoint } = req.query;
  const apiKey = process.env.VITE_GIPHY_API_KEY;

  // Debug information
  console.log('Endpoint:', endpoint);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('Environment:', process.env.NODE_ENV);
  console.log('Request method:', req.method);
  console.log('Query params:', req.query);

  if (!apiKey) {
    console.error('API key is missing');
    return res.status(500).json({ 
      error: 'API key not configured',
      details: 'Please check your environment variables in Vercel'
    });
  }

  if (!endpoint) {
    console.error('Endpoint parameter is missing');
    return res.status(400).json({ 
      error: 'Endpoint parameter is required',
      details: 'Please provide a valid Giphy API endpoint'
    });
  }

  try {
    let giphyUrl;
    let options = {};

    if (req.method === 'POST') {
      // For POST requests, use the upload endpoint
      giphyUrl = new URL('https://upload.giphy.com/v1/gifs');
      giphyUrl.searchParams.set('api_key', apiKey);
      options = {
        method: 'POST',
        body: req.body
      };
    } else {
      // For GET requests, use the regular API endpoint
      giphyUrl = new URL(`https://api.giphy.com/v1/${endpoint}`);
      giphyUrl.searchParams.set('api_key', apiKey);
      
      // Add all other query parameters
      Object.entries(req.query).forEach(([key, value]) => {
        if (key !== 'endpoint') {
          giphyUrl.searchParams.append(key, value);
        }
      });
    }

    // Debug the final URL (without exposing the API key)
    console.log('Request URL:', giphyUrl.toString().replace(apiKey, 'REDACTED'));
    console.log('Request headers:', JSON.stringify(req.headers));

    const response = await fetch(giphyUrl.toString(), options);
    const data = await response.json();

    // Debug the response
    console.log('Response status:', response.status);
    console.log('Response headers:', JSON.stringify(Object.fromEntries(response.headers)));
    console.log('Response data:', JSON.stringify(data).slice(0, 200) + '...');

    if (!response.ok) {
      console.error('Giphy API error:', data);
      return res.status(response.status).json({
        error: 'Giphy API error',
        details: data
      });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching from Giphy API:', error);
    res.status(500).json({ 
      error: 'Error fetching from Giphy API',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 