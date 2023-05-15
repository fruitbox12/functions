const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();

// Define the callback route for Strava API
app.post('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange the authorization code for an access token
    const response = await axios.post('https://www.strava.com/api/v3/oauth/token', qs.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = response.data;

    // Use the access token to make API requests on behalf of the user
    // You can store the access token in your database or session for future use

    res.send('Authorization successful!');
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred during authorization');
  }
});

module.exports = app;
