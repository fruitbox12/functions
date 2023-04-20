# Fetching User Activities from Strava API

This project demonstrates how to fetch user activities from the Strava API using JavaScript. The code fetches an access token using a refresh token and fetches the user's activities from the API.

## Setup

1. Obtain a refresh token for a user from the Strava API by following the [Strava API authentication flow](https://developers.strava.com/docs/authentication/).
2. Replace the `refreshToken` variable in the script with the user's refresh token.
3. Implement the `/refresh_token` endpoint on your server-side to exchange the refresh token for an access token.

## Usage

The code contains two key functions:

- `getAccessToken()`: This function sends a request to the `/refresh_token` endpoint, which should be implemented on your server-side, to obtain an access token using the refresh token.
- `getUserActivities(accessToken)`: This function fetches the user's activities from the Strava API using the access token obtained from `getAccessToken()`.

The code uses the `fetch()` method to make API calls and the `Authorization: Bearer <token>` header to authenticate the user with the Strava API.

Add a `<pre>` element with the ID 'activities' to your HTML to display the fetched user activities:

```html
<pre id="activities"></pre>
