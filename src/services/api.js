import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const searchSongs = async (query, maxResults = 20) => {
  try {
    const response = await api.get('/search', {
      params: { q: query, maxResults }
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
};

export const getTrending = async () => {
  try {
    const response = await api.get('/trending');
    return response.data;
  } catch (error) {
    console.error('Trending error:', error);
    throw error;
  }
};

export const MOOD_QUERIES = {
  Romantic: 'romantic love songs playlist',
  Workout: 'gym motivation workout songs',
  Focus: 'lofi study music focus beats',
  Sad: 'sad emotional songs playlist',
  Party: 'party remix songs dance hits'
};

export default api;
