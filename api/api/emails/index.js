module.exports = (req, res) => {
  // Mocked email messages
  const emailMessages = [
    {
      id: '1',
      subject: 'GMAIL API',
      sender: 'sgrady@innerexplorer.org',
      body: '72778325262-k4767u04tcv95g7v55ef9fvslc90dnmg.apps.googleusercontent.com'
    },
    {
      id: '2',
      subject: 'Gmail API Reference',
      sender: 'sgrady@innerexplorer.org',
      body: 'https://developers.google.com/gmail/api/reference/rest'
    }
  ];

  res.status(200).json(emailMessages);
};
