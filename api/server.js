require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/refresh_token', async (req, res) => {
  // const refreshToken = req.body.refresh_token;

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: '105800',
      client_secret: 'e45197ee2776af37bebb66a16e5bcfed1b9052e7',
      grant_type: 'refresh_token',
      refresh_token: '8d9bd423574b021bcf884074057a161a773066fa',
    });

    res.json(response.data);
  } catch (error) {
    res.status(400).json({ error: 'Failed to refresh token' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:\${port}`);
});
