export default async function handler(req, res) {
  const { path } = req.query;
  const apiKey = process.env.VITE_GIPHY_API_KEY;

  // Debug information
  console.log('Path:', path);
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey ? apiKey.length : 0);
  console.log('Environment:', process.env.NODE_ENV);

  if (!apiKey) {
    console.error('API key is missing');
    return res.status(500).json({ 
      error: 'API key not configured',
      details: 'Please check your environment variables in Vercel'
    });
  }

  if (!path) {
    console.error('Path parameter is missing');
    return res.status(400).json({ 
      error: 'Path parameter is required',
      details: 'Please provide a valid Giphy API path'
    });
  }

  try {
    // Get query parameters from the original request
    const queryParams = new URLSearchParams(req.url.split('?')[1] || '');
    
    // Build the Giphy API URL
    const giphyUrl = new URL(`https://api.giphy.com/v1/${path}`);
    
    // Add API key first
    giphyUrl.searchParams.set('api_key', apiKey);
    
    // Add all other query parameters
    queryParams.forEach((value, key) => {
      if (key !== 'path') {
        giphyUrl.searchParams.append(key, value);
      }
    });

    // Debug the final URL (without exposing the API key)
    console.log('Request URL:', giphyUrl.toString().replace(apiKey, 'REDACTED'));
    console.log('Request method:', req.method);
    console.log('Request headers:', JSON.stringify(req.headers));

    const response = await fetch(giphyUrl.toString());
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