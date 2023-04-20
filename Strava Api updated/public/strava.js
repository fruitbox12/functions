
const refreshToken = '8d9bd423574b021bcf884074057a161a773066fa'; // Replace with the user's refresh token

async function getAccessToken() {
  try {
    const response = await fetch('/refresh_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await response.json();
    // gets the data from the response
    console.log(data)
    //this spits out the access token
    console.log('Access token:', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
  }
  
}

async function getUserActivities(accessToken) {
  try {
    const response = await fetch('https://www.strava.com/api/v3/athlete/activities', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    // console.log('User activities:', data);
    // console.log(accessToken);
    document.getElementById('activities').textContent = JSON.stringify(data, null, 2);
  } catch (error) {
    console.error('Error fetching user activities:', error);
  }
}

(async () => {
  const accessToken = await getAccessToken();
  getUserActivities(accessToken);
})();

