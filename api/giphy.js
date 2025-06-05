export default async function handler(req, res) {
  const { endpoint, ...queryParams } = req.query;
  
  const queryString = new URLSearchParams({
    api_key: process.env.GIPHY_API_KEY,
    ...queryParams
  }).toString();

  const url = `${process.env.GIPHY_BASE_URL}/${endpoint}?${queryString}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching from Giphy' });
  }
} 