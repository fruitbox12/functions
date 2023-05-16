const express = require('express');
const axios = require('axios');
const qs = require('qs');

const app = express();
// Mocked data
const messages = [
  { id: '1', subject: 'First email', sender: 'sender@example.com', body: 'Hello!' },
  { id: '2', subject: 'Second email', sender: 'sender@example.com', body: 'Hi there!' },
  { id: '3', subject: 'Third email', sender: 'sender@example.com', body: 'How are you?' }
];

app.get('/api/emails', (req, res) => {
  const email = 'sgrady@innerexplorer.org';

  // Filter messages for the specified email address
  const filteredMessages = messages.filter(message => message.sender === email);

  res.json(filteredMessages);
});

module.exports = app;
