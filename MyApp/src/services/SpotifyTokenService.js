import { encode as btoa } from 'base-64';

const clientId = 'f7423245d11844509a9df32a7582e54d';
const clientSecret = '1f13bfca95464933920942d929f03671';

let cachedToken = null;
let tokenExpiry = 0;

export async function getAccessToken() {
  const now = Date.now();
  // If token exists and hasn't expired, return it.
  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  // Otherwise, request a new token
  const credentials = `${clientId}:${clientSecret}`;
  const encodedCredentials = btoa(credentials);

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${encodedCredentials}`,
      },
      body: 'grant_type=client_credentials',
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error fetching token: ${response.status} ${errorText}`);
    }
    const data = await response.json();
    cachedToken = data.access_token;
    // Set expiry time using a 60-second buffer so we refresh before the token actually expires
    tokenExpiry = now + data.expires_in * 1000 - 60000;
    return cachedToken;
  } catch (error) {
    console.error('Error in getAccessToken:', error);
    throw error;
  }
}
