
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(bodyParser.json());

app.use(express.static('src'));
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

app.post("/save_strava_data", (req, res) => {
  const { name, distance, user_id } = req.body;
  const strava_data = { name, distance, user_id };
  const jsonString = JSON.stringify(strava_data);

  fs.writeFile("../api.json", jsonString, "utf8", (err) => {
    if (err) {
      console.log("Error writing Strava json file", err);
      res.status(500).json({ error: "Failed to save Strava data" });
    } else {
      console.log("Successfully wrote Strava json file");
      res.json({ message: "Strava data saved successfully" });
    }
  });
});

// // Parse Data from strava.json into the pass goal function in the smart contract
// fs.readFile("../strava.json", "utf8", async (err, jsonString) => {
//   if (err) {
//     console.log("Error reading file from disk:", err);
//     return;
//   }
//   console.log("File data:", jsonString);

//   const api = JSON.parse(jsonString);
//   console.log("User Id is", api.user_id_info); 
//   if (typeof api.user_id_info === 'string') {
//       console.log('Variable is a string!');
//   }
//   else {
//       console.log('Variable is not a string!');
//   }
//   console.log("Goal Id is", api.goal_id_info); 
//   if (typeof api.goal_id_info === 'string') {
//       console.log('Variable is a string!');
//   }
//   else {
//       console.log('Variable is not a string!');
//   }
// });


app.listen(port, () => {
  console.log(`Server listening at http://localhost:\${port}`);
});









