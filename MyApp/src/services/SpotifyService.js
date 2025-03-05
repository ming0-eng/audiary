const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// Fetch album data by album ID using a provided access token.
export const fetchAlbumData = async (albumId, accessToken) => {
  try {
    const response = await fetch(`${SPOTIFY_BASE_URL}/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      throw new Error('Spotify API request failed');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching album data from Spotify:', error);
    throw error;
  }
};
