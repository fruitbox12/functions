const fetch = require('node-fetch');

const token = 'BQANfKbKj1FmSUosZ-w4OkLSfqesTm2T6WNkZIE_bc2-18fq9ABcI1Skon7-MjS5kzcJRCdodP-pA_GGPGN29Ow6J51ezTrhin8lOikKmNzf-suVrME';

async function fetchWebApi(endpoint, method, body) {
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  return (await fetchWebApi('v1/me/top/tracks?time_range=short_term&limit=5', 'GET')).items;
}

module.exports = async (req, res) => {
  try {
    const topTracks = await getTopTracks();
    res.status(200).json(
      topTracks.map(({ name, artists }) =>
        `${name} by ${artists.map((artist) => artist.name).join(', ')}`
      )
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch top tracks' });
  }
};
