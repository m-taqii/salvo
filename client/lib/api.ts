import axios from 'axios';

// Default API URL fallback, overridden by environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for sending/receiving HTTP-only cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

export const setApiToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};
