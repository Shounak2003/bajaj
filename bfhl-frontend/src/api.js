import axios from 'axios';

// Base URL of your backend
const BASE_URL = 'https://<your-backend-url>.netlify.app/.netlify/functions/api';

// Function to make a POST request to /bfhl
export const postData = async (data) => {
  try {
    const response = await axios.post(`${BASE_URL}/bfhl`, { data });
    return response.data;
  } catch (error) {
    console.error('Error during API call', error);
    throw error;
  }
};
