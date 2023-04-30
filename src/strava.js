
const refreshToken = "8d9bd423574b021bcf884074057a161a773066fa"; // Replace with the user's refresh token

async function getAccessToken() {
  try {
    const response = await fetch("/refresh_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await response.json();
    // gets the data from the response
    console.log(data);
    //this spits out the access token
    console.log("Access token:", data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
}

async function getUserActivities(accessToken) {
  try {
    const response = await fetch(
      "https://www.strava.com/api/v3/athlete/activities",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    console.log("User activities:", data);

    // Extract the name and distance from the first activity (as an example)
    const firstActivity = data[0];
    const name = firstActivity.name;
    const distance = firstActivity.distance;
    const user_id = firstActivity.athlete.id;

    // Call the function to display data on the HTML page
    displayActivitiesData(name, distance, user_id);

    // Call the function to send data to the server
    sendStravaData(name, distance, user_id);
    
  } catch (error) {
    console.error("Error fetching user activities:", error);
  }
}

function displayActivitiesData(name, distance, user_id) {
    const activitiesElement = document.getElementById("activities");
    activitiesElement.innerHTML = `Name: ${name}<br>Distance: ${distance}<br>User ID: ${user_id}`;
  }

async function sendStravaData(name, distance, user_id) {
    try {
      const response = await fetch("/save_strava_data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, distance, user_id }),
      });
  
      const result = await response.json();
      console.log("Saved Strava data:", result);
    } catch (error) {
      console.error("Error sending Strava data to server:", error);
    }
  }
  

(async () => {
  const accessToken = await getAccessToken();
  getUserActivities(accessToken);
})();
