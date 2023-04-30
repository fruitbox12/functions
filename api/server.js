require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/refresh_token', async (req, res) => {
  const baseURL =
    process.env.NODE_ENV === 'production'
      ? `https://${process.env.VERCEL_DOMAIN}`
      : 'http://localhost';

  try {
    const response = await axios.post(`${baseURL}/oauth/token`, {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: process.env.REFRESH_TOKEN,
    });

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at ${baseURL}:${port}`);
});
