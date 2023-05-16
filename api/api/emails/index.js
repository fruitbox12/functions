const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
// Mocked data
const messages = [
  { id: '1', subject: 'GMAIL API', sender: 'sgrady@innerexplorer.org', body: '72778325262-k4767u04tcv95g7v55ef9fvslc90dnmg.apps.googleusercontent.com' },
  { id: '2', subject: 'Gmail API Reference', sender: 'sgrady@innerexplorer.org', body: 'https://developers.google.com/gmail/api/reference/rest' }
];

app.get('/api/emails', (req, res) => {
  const email = 'sgrady@innerexplorer.org';

  // Filter messages for the specified email address
  const filteredMessages = messages.filter(message => message.sender === email);

  res.json(filteredMessages);
});

module.exports = app;
